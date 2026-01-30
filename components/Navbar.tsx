'use client';

import Link from 'next/link';
import { useState } from 'react';
import Search from './Search';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="glass sticky top-4 left-4 right-4 mx-auto max-w-7xl rounded-2xl z-50 mt-4 mb-4">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-[#3B82F6] hover:text-[#60A5FA] transition-colors duration-200">
              Git 文档
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-6 flex-1 max-w-md mx-8">
            <Search />
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/"
              className="text-[#1E293B] hover:text-[#3B82F6] transition-colors duration-200 font-medium"
            >
              首页
            </Link>
            <Link
              href="/docs"
              className="text-[#1E293B] hover:text-[#3B82F6] transition-colors duration-200 font-medium"
            >
              所有文档
            </Link>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-[#1E293B] hover:text-[#3B82F6] transition-colors duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-2">
            <div className="mb-4">
              <Search />
            </div>
            <Link
              href="/"
              className="block text-[#E2E8F0] hover:text-[#3B82F6] transition-colors duration-200 font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              首页
            </Link>
            <Link
              href="/docs"
              className="block text-[#E2E8F0] hover:text-[#3B82F6] transition-colors duration-200 font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              所有文档
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
