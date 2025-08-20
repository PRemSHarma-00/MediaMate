function MediaCard({ title, onRemove }) {
  return (
    <div className="flex justify-between items-center bg-gray-100 dark:bg-gray-800 p-3 rounded-lg shadow-sm">
      <span className="text-gray-900 dark:text-gray-100">{title}</span>
      <button 
        onClick={onRemove} 
        className="text-red-500 hover:text-red-700 transition-colors"
      >
        ✕
      </button>
    </div>
  );
}

export default MediaCard;