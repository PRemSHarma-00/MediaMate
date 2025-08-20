
import { useState } from "react";

export default function AuthForm({ onSubmit, title, buttonText }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError("");
      await onSubmit(email, password);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white shadow-xl rounded-xl p-8 space-y-5"
      >
        <h2 className="text-2xl font-bold text-center">{title}</h2>
        {error && (
          <div className="bg-red-100 text-red-600 p-2 rounded text-sm text-center">
            {error}
          </div>
        )}
        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 border rounded outline-none focus:ring focus:border-black"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 border rounded outline-none focus:ring focus:border-black"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full bg-black text-white p-3 rounded hover:opacity-90 transition"
        >
          {buttonText}
        </button>
      </form>
    </div>
  );
}
