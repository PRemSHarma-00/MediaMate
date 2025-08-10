// controllers/suggestionController.js
const axios = require("axios");

// Helper: extract JSON array from Gemini response
function extractJSONArray(text) {
  if (!text || typeof text !== "string") return null;

  const fenceMatch = text.match(/```(?:json)?([\s\S]*?)```/i);
  if (fenceMatch) text = fenceMatch[1];

  const start = text.indexOf("[");
  const end = text.lastIndexOf("]");
  if (start === -1 || end === -1 || end <= start) return null;

  try {
    const slice = text.slice(start, end + 1);
    const parsed = JSON.parse(slice);
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

// Fetch poster from OMDb
async function fetchPoster(title, year, type) {
  const key = process.env.OMDB_API_KEY;
  if (!key) return null;

  try {
    const url = `https://www.omdbapi.com/?apikey=${key}&t=${encodeURIComponent(
      title
    )}${year ? `&y=${year}` : ""}${type ? `&type=${type}` : ""}`;

    const resp = await axios.get(url);
    const data = resp.data;
    if (data.Response === "True" && data.Poster && data.Poster !== "N/A") {
      return data.Poster;
    }
  } catch (_) {
    return null;
  }

  return null;
}

const getSuggestionsFromGemini = async (req, res) => {
  const { media } = req.body;

  if (!media || !Array.isArray(media) || media.length === 0) {
    return res.status(400).json({ error: "Please provide media input" });
  }

  try {
    const inputText = media.map((m, idx) => `${idx + 1}. ${m.title}`).join("\n");

    const prompt = `
You are a recommendation engine. Given a list of movies/TV series/anime a user likes, suggest 6 similar titles across any format.

Requirements:
- Do NOT repeat the input titles.
- Each item must be widely known and findable on OMDb/TMDb.
- Keep reasons spoiler-free and under 60 words.
- Output ONLY a valid JSON array, no prose, no markdown, no comments.

Schema (exact keys):
[
  {
    "title": "string",
    "type": "movie | series | anime",
    "year": 2014,
    "genres": ["string", "string"],
    "reason": "string"
  }
]

User likes:
${inputText}

Return exactly 6 items in the array.
`.trim();

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [{ role: "user", parts: [{ text: prompt }] }],
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    const geminiText =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "No suggestions found";

    let items = extractJSONArray(geminiText) || [];

    // Normalize and fetch posters
    items = await Promise.all(
      items.map(async (s) => {
        const posterUrl = await fetchPoster(s.title, s.year, s.type);
        return {
          title: s.title || "",
          type: s.type || "",
          year: s.year || null,
          genres: Array.isArray(s.genres) ? s.genres : [],
          reason: s.reason || "",
          posterUrl: posterUrl || null,
        };
      })
    );

    // Fallback readable text
    const suggestionsText = items.length
      ? items
          .map(
            (s, i) =>
              `${i + 1}. Title: ${s.title}\nType: ${s.type}${s.year ? ` • ${s.year}` : ""}\nReason: ${s.reason}`
          )
          .join("\n\n")
      : geminiText;

    return res.status(200).json({
      suggestions: suggestionsText,
      items,
    });
  } catch (error) {
    console.error("Gemini API error:", error.response?.data || error.message);
    return res.status(500).json({ error: "Failed to fetch suggestions from Gemini" });
  }
};

module.exports = {
  getSuggestionsFromGemini,
};
