import React, { useState, useEffect } from "react";
import axios from "axios";
import MediaInput from "../components/MediaInput";
import { Sparkles, BookmarkPlus, Film, Tv, Swords, AlertCircle } from "lucide-react";
import useAuthStore from "../store/authStore";

const typeIcon = { movie: Film, tv: Tv, anime: Swords };

// A fixed set of visually rich anime poster images for the background rotation
const BG_IMAGES = [
  "https://cdn.myanimelist.net/images/anime/1015/138006l.jpg",
  "https://cdn.myanimelist.net/images/anime/1208/94745l.jpg",
  "https://cdn.myanimelist.net/images/anime/1286/99889l.jpg",
  "https://cdn.myanimelist.net/images/anime/1223/96541l.jpg",
  "https://cdn.myanimelist.net/images/anime/1521/100800l.jpg",
];

const MediaSuggestionPage = () => {
  const [mediaList, setMediaList] = useState([]);
  const [suggestion, setSuggestion] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [savedIds, setSavedIds] = useState(new Set());
  const [bgIndex, setBgIndex] = useState(0);
  const { user } = useAuthStore();

  // Rotate background every 8s
  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % BG_IMAGES.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const getSuggestions = async () => {
    if (mediaList.length === 0) {
      setSuggestion("Please add at least one media title.");
      setItems([]);
      return;
    }
    setLoading(true);
    setSuggestion("");
    setItems([]);
    try {
      const baseUrl = (import.meta.env.VITE_RENDER_API_URL || "http://localhost:5000").replace(/\/$/, "");
      const res = await axios.post(`${baseUrl}/api/suggest`, { media: mediaList });
      const text = res.data?.suggestions || res.data?.suggestion || "";
      const arr = Array.isArray(res.data?.items) ? res.data.items : [];
      setSuggestion(text || (!arr.length ? "No suggestions found." : ""));
      setItems(arr);
    } catch (err) {
      console.error(err);
      setSuggestion("Error fetching suggestions. Please try again.");
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const saveToJournal = (item) => {
    if (!user) return;
    const key = `journal_${user.uid}`;
    const existing = JSON.parse(localStorage.getItem(key) || "[]");
    const entry = {
      id: Date.now(),
      title: item.title,
      type: item.type || "movie",
      status: "want",
      rating: 0,
      note: item.reason || "",
      posterUrl: item.posterUrl || null,
      year: item.year || "",
      genres: item.genres || [],
      addedAt: new Date().toISOString(),
    };
    localStorage.setItem(key, JSON.stringify([entry, ...existing]));
    setSavedIds((prev) => new Set([...prev, item.title]));
  };

  const TypeBadge = ({ type }) => {
    const Icon = typeIcon[type?.toLowerCase()] || Film;
    const colors = {
      movie: "bg-blue-500/20 text-blue-300 border-blue-500/30",
      tv:    "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
      anime: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
    };
    return (
      <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border font-medium ${colors[type?.toLowerCase()] || colors.movie}`}>
        <Icon size={11} />
        {type}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-[#050508] text-white relative">

      {/* ── Anime poster hero background (same as homepage) ── */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Rotating poster */}
        <div
          key={bgIndex}
          className="absolute inset-0 bg-cover bg-center kenburns transition-opacity duration-1000"
          style={{ backgroundImage: `url(${BG_IMAGES[bgIndex]})` }}
        />
        {/* Heavy dark mask — same gradient as Home.jsx */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050508] via-[#050508]/80 to-[#050508]/60" />
        {/* Extra bottom fade so content area is fully readable */}
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-[#050508] to-transparent" />
      </div>

      {/* ── Content ── */}
      <div className="relative z-10 max-w-3xl mx-auto px-6 py-12">

        {/* Hero header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 text-xs font-medium text-blue-400 bg-blue-500/10 border border-blue-500/20 rounded-full px-3 py-1 mb-4">
            <Sparkles size={12} />
            AI-Powered Recommendations
          </div>
          <h1 className="font-heading text-4xl font-bold mb-2">
            Discover <span className="text-blue-400">Your Next</span> Obsession
          </h1>
          <p className="text-gray-400">
            Tell us what you love — anime, movies, TV shows — and we'll find what's next.
          </p>
        </div>

        {/* Input section — no white card, blends into the bg */}
        <div className="mb-6 space-y-4">
          <h2 className="font-heading text-lg font-semibold text-gray-200">What have you enjoyed?</h2>
          <MediaInput onChange={setMediaList} />

          {mediaList.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {mediaList.map((item, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 bg-blue-500/10 border border-blue-500/30 text-blue-300 px-3 py-1 rounded-full text-sm"
                >
                  {item.title}
                </span>
              ))}
            </div>
          )}

          <button
            id="get-suggestions-btn"
            onClick={getSuggestions}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-blue-900/30 hover:shadow-blue-800/40 hover:-translate-y-0.5"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Searching...
              </>
            ) : (
              <>
                <Sparkles size={16} />
                Get Suggestions
              </>
            )}
          </button>
        </div>

        {/* Divider before results */}
        {(items.length > 0 || suggestion) && !loading && (
          <div className="border-t border-white/10 my-8" />
        )}

        {/* Text fallback */}
        {!loading && suggestion && items.length === 0 && (
          <div className="glass-card p-6 flex items-start gap-3">
            <AlertCircle size={18} className="text-yellow-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-sm text-gray-200 mb-1">Suggestions</h3>
              <p className="text-gray-400 text-sm whitespace-pre-line">{suggestion}</p>
            </div>
          </div>
        )}

        {/* Results */}
        {!loading && items.length > 0 && (
          <div className="space-y-4">
            <h2 className="font-heading text-xl font-semibold text-gray-100">
              Recommendations
              <span className="text-gray-500 text-sm font-normal ml-2">({items.length} found)</span>
            </h2>
            {items.map((item, idx) => {
              const isSaved = savedIds.has(item.title);
              return (
                <div
                  key={idx}
                  className="glass-card flex overflow-hidden hover:border-blue-500/30 transition-all duration-300 hover:-translate-y-0.5 group"
                >
                  {/* Poster */}
                  <div className="w-28 shrink-0 relative overflow-hidden">
                    {item.posterUrl ? (
                      <img
                        src={item.posterUrl}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        style={{ minHeight: "160px" }}
                      />
                    ) : (
                      <div className="w-full h-full min-h-[160px] bg-white/5 flex items-center justify-center">
                        <Film size={28} className="text-gray-600" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-4 flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="font-heading font-semibold text-base leading-snug">{item.title}</h3>
                        <TypeBadge type={item.type} />
                      </div>
                      <p className="text-xs text-gray-500 mb-2">{item.year}</p>
                      {Array.isArray(item.genres) && item.genres.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {item.genres.map((g) => (
                            <span key={g} className="text-[11px] px-2 py-0.5 bg-white/5 border border-white/10 rounded-full text-gray-400">
                              {g}
                            </span>
                          ))}
                        </div>
                      )}
                      <p className="text-sm text-gray-300 leading-relaxed">{item.reason}</p>
                    </div>

                    {user && (
                      <button
                        onClick={() => saveToJournal(item)}
                        disabled={isSaved}
                        className={`mt-3 self-start flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-all duration-200 ${
                          isSaved
                            ? "bg-green-500/20 text-green-400 border border-green-500/30 cursor-default"
                            : "bg-blue-500/10 text-blue-400 border border-blue-500/30 hover:bg-blue-500/20"
                        }`}
                      >
                        <BookmarkPlus size={13} />
                        {isSaved ? "Saved to Journal" : "Save to Journal"}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Loading skeletons */}
        {loading && (
          <div className="space-y-4 mt-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass-card flex overflow-hidden h-40">
                <div className="w-28 skeleton rounded-l-none" />
                <div className="flex-1 p-4 space-y-3">
                  <div className="h-4 skeleton rounded w-3/4" />
                  <div className="h-3 skeleton rounded w-1/4" />
                  <div className="h-3 skeleton rounded w-full" />
                  <div className="h-3 skeleton rounded w-5/6" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MediaSuggestionPage;
