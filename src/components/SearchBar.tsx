'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SearchBar({ defaultValue = '', large = false }: { defaultValue?: string; large?: boolean }) {
  const [query, setQuery] = useState(defaultValue);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/browse?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search packages, tools, models..."
          className={`w-full bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition-colors ${large ? 'px-5 py-3.5 text-lg' : 'px-4 py-2.5 text-sm'}`}
        />
        <button
          type="submit"
          className={`absolute right-2 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-md transition-colors ${large ? 'top-2 px-5 py-1.5 text-sm' : 'top-1.5 px-3 py-1 text-xs'}`}
        >
          Search
        </button>
      </div>
    </form>
  );
}
