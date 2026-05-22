import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Lock, AlertCircle, ArrowLeft } from "lucide-react";

export default function AuthForm({ onSubmit, title, buttonText, isSignup = false }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError("");
      setLoading(true);
      await onSubmit(email, password);
    } catch (err) {
      setError(err.message?.replace("Firebase: ", "").replace(/\(auth.*\)\.?/, "").trim() || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050508] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Animated blue orbs */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      {/* Card */}
      <div className="relative z-10 w-full max-w-md">
        {/* Back to home */}
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-blue-400 transition-colors mb-6"
        >
          <ArrowLeft size={14} />
          Back to home
        </Link>

        <div className="glass-card p-8 shadow-2xl shadow-black/50">
          {/* Header — no logo, just text */}
          <div className="mb-8">
            <h1 className="font-heading text-2xl font-bold text-white">{title}</h1>
            <p className="text-gray-400 text-sm mt-1">
              {isSignup ? "Join and start tracking your media." : "Welcome back to MediaMate."}
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 flex items-start gap-2.5 bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl px-4 py-3">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
              <input
                id="auth-email"
                type="email"
                placeholder="Email address"
                className="w-full bg-white/[0.06] border border-white/10 text-white placeholder-gray-500 rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:border-blue-500/60 focus:bg-white/[0.08] focus:ring-1 focus:ring-blue-500/30 transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
              <input
                id="auth-password"
                type="password"
                placeholder="Password"
                className="w-full bg-white/[0.06] border border-white/10 text-white placeholder-gray-500 rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:border-blue-500/60 focus:bg-white/[0.08] focus:ring-1 focus:ring-blue-500/30 transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete={isSignup ? "new-password" : "current-password"}
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              id="auth-submit-btn"
              disabled={loading}
              className="w-full mt-2 py-3 rounded-xl font-semibold text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-blue-900/30 hover:shadow-blue-800/40 hover:-translate-y-0.5"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  {isSignup ? "Creating account..." : "Signing in..."}
                </span>
              ) : buttonText}
            </button>
          </form>

          {/* Toggle link */}
          <div className="mt-6 text-center text-sm text-gray-500">
            {isSignup ? (
              <>Already have an account?{" "}
                <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">Log in</Link>
              </>
            ) : (
              <>Don't have an account?{" "}
                <Link to="/signup" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">Sign up</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
