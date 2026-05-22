import React, { useState } from "react";
import { Search, Plus, X } from "lucide-react";

const MediaInput = ({ onChange }) => {
  const [inputs, setInputs] = useState(["", ""]);

  const handleChange = (value, index) => {
    const updated = [...inputs];
    updated[index] = value;
    setInputs(updated);
    onChange(
      updated
        .filter((item) => item.trim() !== "")
        .map((title) => ({ title }))
    );
  };

  const addInput = () => {
    setInputs([...inputs, ""]);
  };

  const removeInput = (index) => {
    if (inputs.length <= 2) return;
    const updated = inputs.filter((_, i) => i !== index);
    setInputs(updated);
    onChange(updated.filter((t) => t.trim() !== "").map((title) => ({ title })));
  };

  return (
    <div className="space-y-2.5 w-full">
      {inputs.map((input, index) => (
        <div key={index} className="relative flex items-center group">
          <Search
            size={15}
            className="absolute left-3.5 text-gray-500 pointer-events-none"
          />
          <input
            type="text"
            placeholder={`Title ${index + 1} — e.g. Naruto, Breaking Bad...`}
            value={input}
            onChange={(e) => handleChange(e.target.value, index)}
            className="w-full bg-white/[0.06] border border-white/10 text-white placeholder-gray-600 rounded-xl pl-9 pr-9 py-2.5 text-sm outline-none focus:border-blue-500/50 focus:bg-white/[0.09] focus:ring-1 focus:ring-blue-500/20 transition-all"
          />
          {inputs.length > 2 && (
            <button
              type="button"
              onClick={() => removeInput(index)}
              className="absolute right-3 text-gray-600 hover:text-red-400 transition-colors"
            >
              <X size={14} />
            </button>
          )}
        </div>
      ))}
      <button
        type="button"
        onClick={addInput}
        className="flex items-center gap-1.5 text-sm text-blue-400 hover:text-blue-300 transition-colors mt-1"
      >
        <Plus size={14} />
        Add another title
      </button>
    </div>
  );
};

export default MediaInput;
