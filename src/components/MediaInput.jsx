import React, { useState } from "react";

const MediaInput = ({ onChange }) => {
  const [inputs, setInputs] = useState(["", ""]);

  const handleChange = (value, index) => {
    const updated = [...inputs];
    updated[index] = value;
    setInputs(updated);

    // Send array of objects to parent
    onChange(
      updated
        .filter((item) => item.trim() !== "")
        .map((title) => ({ title }))
    );
  };

  const addInput = () => {
    setInputs([...inputs, ""]);
  };

  return (
    <div className="p-4 bg-white rounded-xl shadow-md w-full max-w-2xl">
      {inputs.map((input, index) => (
        <div key={index} className="mb-3">
          <input
            type="text"
            placeholder={`Media Title ${index + 1}`}
            value={input}
            onChange={(e) => handleChange(e.target.value, index)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 placeholder-gray-400"
          />
        </div>
      ))}
      <div className="flex gap-3 mt-2">
        <button
          type="button"
          onClick={addInput}
          className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800"
        >
          + Add Another
        </button>
      </div>
    </div>
  );
};

export default MediaInput;
