import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useAuthStore from "../store/authStore";
import {
  BookOpen, Plus, X, Star, Trash2, Film, Tv, Swords,
  CheckCircle2, Bookmark, XCircle, Sparkles, PenLine
} from "lucide-react";

// ─── Constants ────────────────────────────────────────────────────────────────
const STATUSES = [
  { key: "all",     label: "All",            icon: BookOpen,      color: "text-gray-300" },
  { key: "watched", label: "Watched",         icon: CheckCircle2,  color: "text-green-400" },
  { key: "want",    label: "Want to Watch",   icon: Bookmark,      color: "text-purple-400" },
  { key: "dropped", label: "Dropped",         icon: XCircle,       color: "text-red-400" },
];

const TYPES = ["movie", "anime", "tv"];

const TYPE_META = {
  movie: { icon: Film,   color: "bg-blue-500/20 text-blue-300 border-blue-500/30" },
  tv:    { icon: Tv,     color: "bg-green-500/20 text-green-300 border-green-500/30" },
  anime: { icon: Swords, color: "bg-orange-500/20 text-orange-300 border-orange-500/30" },
};

const STATUS_META = {
  watched: { label: "Watched",       icon: CheckCircle2, color: "bg-green-500/20 text-green-300 border-green-500/30" },
  want:    { label: "Want to Watch", icon: Bookmark,     color: "bg-purple-500/20 text-purple-300 border-purple-500/30" },
  dropped: { label: "Dropped",       icon: XCircle,      color: "bg-red-500/20 text-red-300 border-red-500/30" },
};

// ─── Sub-components ────────────────────────────────────────────────────────────
const StarRating = ({ value, onChange }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((s) => (
      <button
        key={s}
        type="button"
        className="star-btn"
        onClick={() => onChange(s === value ? 0 : s)}
        aria-label={`Rate ${s}`}
      >
        <Star
          size={18}
          className={s <= value ? "text-yellow-400 fill-yellow-400" : "text-gray-600"}
        />
      </button>
    ))}
  </div>
);

const TypeBadge = ({ type }) => {
  const meta = TYPE_META[type] || TYPE_META.movie;
  const Icon = meta.icon;
  return (
    <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border font-medium ${meta.color}`}>
      <Icon size={11} />
      {type}
    </span>
  );
};

const StatusBadge = ({ status }) => {
  const meta = STATUS_META[status] || STATUS_META.want;
  const Icon = meta.icon;
  return (
    <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border font-medium ${meta.color}`}>
      <Icon size={11} />
      {meta.label}
    </span>
  );
};

// ─── Main Component ─────────────────────────────────────────────────────────────
const Journal = () => {
  const { user } = useAuthStore();
  const storageKey = user ? `journal_${user.uid}` : null;

  const [entries, setEntries] = useState([]);
  const [filter, setFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [editEntry, setEditEntry] = useState(null);

  // Form state
  const [form, setForm] = useState({
    title: "", type: "movie", status: "watched", rating: 0, note: ""
  });

  // Load from localStorage
  useEffect(() => {
    if (!storageKey) return;
    const raw = localStorage.getItem(storageKey);
    if (raw) {
      try { setEntries(JSON.parse(raw)); } catch { setEntries([]); }
    }
  }, [storageKey]);

  // Persist
  const persist = (updated) => {
    setEntries(updated);
    if (storageKey) localStorage.setItem(storageKey, JSON.stringify(updated));
  };

  // Open add modal
  const openAdd = () => {
    setEditEntry(null);
    setForm({ title: "", type: "movie", status: "watched", rating: 0, note: "" });
    setShowModal(true);
  };

  // Open edit modal
  const openEdit = (entry) => {
    setEditEntry(entry);
    setForm({ title: entry.title, type: entry.type, status: entry.status, rating: entry.rating, note: entry.note || "" });
    setShowModal(true);
  };

  // Save entry
  const handleSave = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;

    if (editEntry) {
      const updated = entries.map((en) =>
        en.id === editEntry.id ? { ...en, ...form } : en
      );
      persist(updated);
    } else {
      const entry = {
        id: Date.now(),
        ...form,
        posterUrl: null,
        year: "",
        genres: [],
        addedAt: new Date().toISOString(),
      };
      persist([entry, ...entries]);
    }
    setShowModal(false);
  };

  // Delete
  const handleDelete = (id) => {
    persist(entries.filter((e) => e.id !== id));
  };

  // Quick status cycle
  const cycleStatus = (id) => {
    const cycle = { watched: "want", want: "dropped", dropped: "watched" };
    persist(entries.map((e) => e.id === id ? { ...e, status: cycle[e.status] } : e));
  };

  // Filtered
  const filtered = filter === "all" ? entries : entries.filter((e) => e.status === filter);

  // Stats
  const stats = {
    total: entries.length,
    watched: entries.filter((e) => e.status === "watched").length,
    want: entries.filter((e) => e.status === "want").length,
    dropped: entries.filter((e) => e.status === "dropped").length,
  };

  return (
    <div className="min-h-screen bg-[#050508] text-white relative">
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-1/3 w-96 h-96 bg-purple-600/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-pink-600/8 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex items-start justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-medium text-purple-400 bg-purple-500/10 border border-purple-500/20 rounded-full px-3 py-1 mb-3">
              <PenLine size={12} />
              My Media Journal
            </div>
            <h1 className="font-heading text-4xl font-bold">
              Your <span className="gradient-text">Journal</span>
            </h1>
            <p className="text-gray-400 mt-1 text-sm">Track everything you've watched, want to watch, or dropped.</p>
          </div>
          <button
            id="add-entry-btn"
            onClick={openAdd}
            className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 transition-all duration-200 shadow-lg shadow-purple-900/30 hover:-translate-y-0.5 text-sm"
          >
            <Plus size={16} />
            Add Entry
          </button>
        </div>

        {/* Stats bar */}
        {entries.length > 0 && (
          <div className="grid grid-cols-4 gap-3 mb-8">
            {[
              { label: "Total", value: stats.total, color: "text-white" },
              { label: "Watched", value: stats.watched, color: "text-green-400" },
              { label: "Want", value: stats.want, color: "text-purple-400" },
              { label: "Dropped", value: stats.dropped, color: "text-red-400" },
            ].map(({ label, value, color }) => (
              <div key={label} className="glass-card p-3 text-center">
                <div className={`font-heading text-2xl font-bold ${color}`}>{value}</div>
                <div className="text-xs text-gray-500 mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {STATUSES.map(({ key, label, icon: Icon, color }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border ${
                filter === key
                  ? "bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-900/30"
                  : "bg-white/[0.04] border-white/10 text-gray-400 hover:bg-white/[0.07] hover:text-gray-200"
              }`}
            >
              <Icon size={14} className={filter === key ? "text-white" : color} />
              {label}
              {key !== "all" && (
                <span className={`ml-1 text-xs ${filter === key ? "text-purple-200" : "text-gray-600"}`}>
                  {stats[key]}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="glass-card p-12 text-center">
            <div className="text-5xl mb-4">📚</div>
            <h3 className="font-heading text-xl font-semibold text-gray-200 mb-2">
              {filter === "all" ? "Your journal is empty" : `No ${filter === "want" ? "want to watch" : filter} entries yet`}
            </h3>
            <p className="text-gray-500 text-sm mb-6">
              {filter === "all"
                ? "Start tracking what you watch. Add your first entry!"
                : "Change the filter or add a new entry."}
            </p>
            {filter === "all" && (
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={openAdd}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 transition-all"
                >
                  <Plus size={15} />
                  Add Entry
                </button>
                <Link
                  to="/mainpage"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-gray-300 bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                >
                  <Sparkles size={15} />
                  Get Suggestions
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Journal entries grid */}
        {filtered.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2">
            {filtered.map((entry) => (
              <div
                key={entry.id}
                className="glass-card p-4 flex flex-col gap-3 hover:border-purple-500/20 transition-all duration-300 group"
              >
                {/* Top row */}
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-heading font-semibold text-base leading-tight flex-1">{entry.title}</h3>
                  <button
                    onClick={() => handleDelete(entry.id)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all shrink-0"
                    aria-label="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                {/* Badges row */}
                <div className="flex items-center gap-2 flex-wrap">
                  <TypeBadge type={entry.type} />
                  <button
                    onClick={() => cycleStatus(entry.id)}
                    title="Click to cycle status"
                    className="transition-all hover:scale-105"
                  >
                    <StatusBadge status={entry.status} />
                  </button>
                </div>

                {/* Star rating */}
                <StarRating
                  value={entry.rating}
                  onChange={(val) => persist(entries.map((e) => e.id === entry.id ? { ...e, rating: val } : e))}
                />

                {/* Note */}
                {entry.note && (
                  <p className="text-sm text-gray-400 leading-relaxed line-clamp-3">{entry.note}</p>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between mt-auto pt-2 border-t border-white/5">
                  <span className="text-xs text-gray-600">
                    {new Date(entry.addedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </span>
                  <button
                    onClick={() => openEdit(entry)}
                    className="flex items-center gap-1 text-xs text-gray-500 hover:text-purple-400 transition-colors"
                  >
                    <PenLine size={12} />
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ─── Modal ─────────────────────────────────────────────────────── */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}
        >
          <div className="glass-card w-full max-w-md p-6 relative shadow-2xl shadow-black/60">
            {/* Close */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 p-1.5 text-gray-500 hover:text-white hover:bg-white/10 rounded-lg transition-all"
            >
              <X size={18} />
            </button>

            <h2 className="font-heading text-xl font-bold mb-6 gradient-text">
              {editEntry ? "Edit Entry" : "New Journal Entry"}
            </h2>

            <form onSubmit={handleSave} className="space-y-4">
              {/* Title */}
              <div>
                <label className="text-xs font-medium text-gray-400 mb-1.5 block">Title *</label>
                <input
                  id="journal-title-input"
                  type="text"
                  placeholder="e.g. Attack on Titan"
                  className="w-full bg-white/[0.06] border border-white/10 text-white placeholder-gray-600 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/30 transition-all"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                  autoFocus
                />
              </div>

              {/* Type + Status row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-400 mb-1.5 block">Type</label>
                  <select
                    id="journal-type-select"
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                    className="w-full bg-white/[0.06] border border-white/10 text-white rounded-xl px-3 py-2.5 text-sm outline-none focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/30 transition-all appearance-none cursor-pointer"
                  >
                    {TYPES.map((t) => (
                      <option key={t} value={t} className="bg-[#111]">{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-400 mb-1.5 block">Status</label>
                  <select
                    id="journal-status-select"
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="w-full bg-white/[0.06] border border-white/10 text-white rounded-xl px-3 py-2.5 text-sm outline-none focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/30 transition-all appearance-none cursor-pointer"
                  >
                    <option value="watched" className="bg-[#111]">Watched</option>
                    <option value="want" className="bg-[#111]">Want to Watch</option>
                    <option value="dropped" className="bg-[#111]">Dropped</option>
                  </select>
                </div>
              </div>

              {/* Rating */}
              <div>
                <label className="text-xs font-medium text-gray-400 mb-1.5 block">Rating</label>
                <StarRating value={form.rating} onChange={(val) => setForm({ ...form, rating: val })} />
              </div>

              {/* Note */}
              <div>
                <label className="text-xs font-medium text-gray-400 mb-1.5 block">Note (optional)</label>
                <textarea
                  id="journal-note-input"
                  placeholder="What did you think?"
                  rows={3}
                  className="w-full bg-white/[0.06] border border-white/10 text-white placeholder-gray-600 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/30 transition-all resize-none"
                  value={form.note}
                  onChange={(e) => setForm({ ...form, note: e.target.value })}
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-medium text-gray-400 bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  id="journal-save-btn"
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 transition-all shadow-lg shadow-purple-900/30"
                >
                  {editEntry ? "Save Changes" : "Add to Journal"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Journal;
