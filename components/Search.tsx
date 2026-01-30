'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { searchDocs, SearchResult } from '@/lib/search';

export default function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={searchRef}>
      <div className="relative">
        <input
          type="text"
          placeholder="搜索文档..."
          value={query}
          onChange={(e) => {
            const value = e.target.value;
            setQuery(value);

            if (value.trim()) {
              const searchResults = searchDocs(value);
              setResults(searchResults.slice(0, 5));
              setIsOpen(true);
            } else {
              setResults([]);
              setIsOpen(false);
            }
          }}
          onFocus={() => query.trim() && setIsOpen(true)}
          className="w-full px-4 py-2.5 pl-10 glass rounded-xl text-[#0F172A] placeholder:text-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/50 transition-all duration-200"
        />
        <svg
          className="absolute left-3 top-3 w-5 h-5 text-[#64748B]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute top-full mt-2 w-full glass-card rounded-xl shadow-2xl z-50 max-h-96 overflow-y-auto">
          {results.map((result) => (
            <Link
              key={result.slug}
              href={`/docs/${result.slug}`}
              onClick={() => {
                setQuery('');
                setIsOpen(false);
              }}
              className="block px-4 py-3 hover:bg-[#3B82F6]/10 transition-colors duration-200 border-b border-[#E2E8F0] last:border-0"
            >
              <div className="font-medium text-[#0F172A]">{result.title}</div>
              <div className="text-sm text-[#475569] mt-1">{result.description}</div>
              <div className="text-xs text-[#3B82F6] mt-1 font-medium">{result.category}</div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
