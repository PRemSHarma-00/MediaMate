import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

const Home = () => {
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);
  const [selectedAnime, setSelectedAnime] = useState(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const res = await axios.get(
          "https://api.jikan.moe/v4/seasons/now?limit=20&order_by=popularity&sort=desc"
        );
        setTrending(res.data.data);
      } catch (err) {
        console.error("Error fetching trending anime", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTrending();
  }, []);

  useEffect(() => {
    if (trending.length > 0) {
      const interval = setInterval(() => {
        setIndex((prev) => (prev + 1) % Math.min(trending.length, 5));
      }, 8000);
      return () => clearInterval(interval);
    }
  }, [trending]);

  const backgrounds = trending.slice(0, 5).map(
    (item) => item.images.jpg.large_image_url
  );

  const scrollByAmount = (offset) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  return (
    <div className="w-full min-h-screen bg-black text-white relative font-body">
      {/* HERO */}
      <div className="relative h-screen w-full overflow-hidden">
        {loading ? (
          <div className="absolute inset-0 bg-gray-800 animate-pulse" />
        ) : (
          <div
            key={index}
            className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000 kenburns"
            style={{ backgroundImage: `url(${backgrounds[index]})` }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black" />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
          <h1 className="font-heading text-5xl md:text-6xl font-extrabold drop-shadow-lg">
            Welcome to <span className="text-purple-400">MediaMate</span> 🎬
          </h1>
          <p className="mt-4 max-w-xl text-lg md:text-xl text-gray-200 drop-shadow">
            Discover your next favorite anime, movie, or TV show. Track. Review.
            Share.
          </p>
        </div>
      </div>

      {/* WHAT’S HOT - CAROUSEL */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="font-heading text-3xl mb-6 border-b-4 border-purple-500 inline-block">
          What’s Hot This Season
        </h2>

        {loading ? (
          <div className="flex gap-4 overflow-hidden">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="bg-gray-800 rounded-lg animate-pulse h-64 w-48"
              />
            ))}
          </div>
        ) : (
          <div className="relative">
            {/* Left arrow */}
            <button
              onClick={() => scrollByAmount(-300)}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full"
            >
              ‹
            </button>

            {/* Scroll container */}
            <div
              ref={scrollRef}
              className="flex overflow-x-auto scroll-smooth no-scrollbar gap-4 px-8"
            >
              {trending.map((item) => (
                <div
                  key={item.mal_id}
                  onClick={() => setSelectedAnime(item)}
                  className="flex-shrink-0 w-48 bg-gray-900 rounded-lg overflow-hidden shadow-lg hover:scale-105 transform transition cursor-pointer"
                >
                  <div
                    className="h-48 bg-cover bg-center"
                    style={{
                      backgroundImage: `url(${item.images.jpg.image_url})`,
                    }}
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold">{item.title}</h3>
                    <p className="text-yellow-400 font-bold">
                      ⭐ {item.score || "N/A"}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Right arrow */}
            <button
              onClick={() => scrollByAmount(300)}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full"
            >
              ›
            </button>
          </div>
        )}
      </section>

      {/* MODAL */}
      {selectedAnime && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-lg max-w-2xl w-full overflow-hidden shadow-xl">
            <div className="flex flex-col md:flex-row">
              <img
                src={selectedAnime.images.jpg.large_image_url}
                alt={selectedAnime.title}
                className="w-full md:w-1/3 object-cover"
              />
              <div className="p-6 flex-1">
                <h2 className="font-heading text-2xl font-bold">
                  {selectedAnime.title}
                </h2>
                <p className="text-yellow-400 font-bold mt-1">
                  ⭐ {selectedAnime.score || "N/A"}
                </p>
                <p className="mt-4 text-gray-300 text-sm leading-relaxed">
                  {selectedAnime.synopsis || "No synopsis available."}
                </p>
                {selectedAnime.genres && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {selectedAnime.genres.map((g) => (
                      <span
                        key={g.name}
                        className="bg-purple-600 px-2 py-1 rounded-full text-xs"
                      >
                        {g.name}
                      </span>
                    ))}
                  </div>
                )}
                <button
                  onClick={() => setSelectedAnime(null)}
                  className="mt-6 px-4 py-2 bg-red-600 hover:bg-red-700 rounded font-semibold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
