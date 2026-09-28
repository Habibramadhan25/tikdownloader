import React, { useState, useEffect, useMemo } from 'react';
import { Trash2, Download, Clock, ExternalLink, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function History() {
  const [history, setHistory] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('tikdown_history') || '[]');
    setHistory(saved);
  }, []);

  const filteredHistory = useMemo(() => {
    return history.filter(item => 
      item.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.author?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [history, searchQuery]);

  const handleClearHistory = () => {
    localStorage.removeItem('tikdown_history');
    setHistory([]);
  };

  const handleRemoveItem = (indexToRemove) => {
    // Need to find the actual index in the original array if filtering
    const actualItem = filteredHistory[indexToRemove];
    const originalIndex = history.findIndex(h => h.url === actualItem.url && h.timestamp === actualItem.timestamp);
    
    if (originalIndex !== -1) {
      const newHistory = history.filter((_, i) => i !== originalIndex);
      localStorage.setItem('tikdown_history', JSON.stringify(newHistory));
      setHistory(newHistory);
    }
  };

  if (history.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center w-full animate-in">
        <div className="w-20 h-20 bg-[hsl(var(--muted))] rounded-full flex items-center justify-center mb-6">
          <Clock className="w-8 h-8 text-[hsl(var(--muted-foreground))]" />
        </div>
        <h2 className="text-2xl font-bold mb-2">No History Yet</h2>
        <p className="text-[hsl(var(--muted-foreground))] mb-8 text-center max-w-md">
          You haven't downloaded any videos yet. Videos you process will appear here automatically.
        </p>
        <Link to="/" className="px-6 py-3 rounded-xl bg-[hsl(var(--foreground))] text-[hsl(var(--background))] font-semibold hover:opacity-90 transition-opacity">
          Start Downloading
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto animate-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[hsl(var(--foreground))] mb-1">Download History</h1>
          <p className="text-[hsl(var(--muted-foreground))] text-sm">Your recently processed videos are saved locally on your device.</p>
        </div>
        <button 
          onClick={handleClearHistory}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors text-sm font-semibold shrink-0"
        >
          <Trash2 className="w-4 h-4" />
          Clear All
        </button>
      </div>

      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[hsl(var(--muted-foreground))]" />
        <input 
          type="text" 
          placeholder="Search history by username or title..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full h-12 pl-12 pr-4 bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-xl text-[hsl(var(--foreground))] focus:outline-none focus:border-indigo-500 transition-colors"
        />
      </div>

      {filteredHistory.length === 0 ? (
        <div className="text-center py-12 text-[hsl(var(--muted-foreground))]">
          No videos matched your search.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredHistory.map((item, index) => (
          <div key={index} className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-2xl overflow-hidden hover:border-indigo-500/30 transition-colors group">
            <div className="h-40 overflow-hidden relative bg-[hsl(var(--muted))]">
              <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-3">
                <span className="text-white text-xs font-medium px-2 py-1 bg-black/50 backdrop-blur-md rounded-md">
                  00:{item.duration}
                </span>
              </div>
              <button 
                onClick={() => handleRemoveItem(index)}
                className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-red-500/80 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all backdrop-blur-md"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4">
              <h3 className="font-bold text-[hsl(var(--foreground))] text-sm line-clamp-2 mb-1">{item.title}</h3>
              <p className="text-xs text-[hsl(var(--muted-foreground))] mb-4">{item.author}</p>
              
              <div className="flex items-center justify-between mt-auto">
                <span className="text-[10px] text-[hsl(var(--muted-foreground))]">
                  {new Date(item.timestamp).toLocaleDateString()}
                </span>
                <Link to="/" state={{ url: item.url }} className="text-xs font-semibold text-indigo-500 hover:text-indigo-400 flex items-center gap-1">
                  Download Again
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
      )}
    </div>
  );
}
