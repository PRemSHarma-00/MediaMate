import React, { useState } from "react";
import axios from "axios";
import MediaInput from "../components/MediaInput";

const MediaSuggestionPage = () => {
  const [mediaList, setMediaList] = useState([]);
  const [suggestion, setSuggestion] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

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
      const res = await axios.post("http://localhost:5000/api/suggest", {
        media: mediaList,
      });

      const text = res.data?.suggestions || res.data?.suggestion || "";
      const arr = Array.isArray(res.data?.items) ? res.data.items : [];

      setSuggestion(text || (!arr.length ? "No suggestions found." : ""));
      setItems(arr);
    } catch (err) {
      console.error(err);
      setSuggestion("Error fetching suggestions.");
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <div className="mx-auto max-w-3xl px-6 py-10">
        <h1 className="text-3xl font-bold mb-2">Search Suggestions</h1>
        <p className="text-sm text-gray-600 mb-6">
          Find similar movies, TV shows, or anime based on your preferences.
        </p>

        <h2 className="text-lg font-semibold mb-2">Enter Media Titles</h2>
        <MediaInput onChange={setMediaList} />

        {mediaList.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {mediaList.map((item, idx) => (
              <span
                key={idx}
                className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm border border-gray-300"
              >
                {item.title}
              </span>
            ))}
          </div>
        )}

        <button
          onClick={getSuggestions}
          disabled={loading}
          className="mt-6 px-5 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 transition"
        >
          {loading ? "Searching..." : "Search Suggestions"}
        </button>

        {/* Fallback if no items */}
        {!loading && suggestion && items.length === 0 && (
          <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-md">
            <h3 className="text-md font-semibold mb-2">Suggestions</h3>
            <p className="text-gray-700 whitespace-pre-line">{suggestion}</p>
          </div>
        )}

        {/* Structured results with posters */}
        {!loading && items.length > 0 && (
          <div className="mt-8 grid gap-6">
            {items.map((item, idx) => (
              <div
                key={idx}
                className="flex bg-gray-50 border border-gray-200 rounded-lg overflow-hidden shadow-sm"
              >
                {item.posterUrl ? (
                  <img
                    src={item.posterUrl}
                    alt={item.title}
                    className="w-28 h-40 object-cover"
                  />
                ) : (
                  <div className="w-28 h-40 bg-gray-200 flex items-center justify-center text-gray-500 text-xs">
                    No Image
                  </div>
                )}

                <div className="p-4 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{item.title}</h3>
                    <p className="text-sm text-gray-600">
                      {item.type} • {item.year}
                    </p>
                    {Array.isArray(item.genres) && item.genres.length > 0 && (
                      <p className="text-sm text-gray-500 mt-1">
                        Genres: {item.genres.join(", ")}
                      </p>
                    )}
                  </div>
                  <p className="mt-3 text-sm text-gray-800">{item.reason}</p>
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
