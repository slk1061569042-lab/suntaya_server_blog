'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getAllCategories, getDocsByCategory, DocMetadata } from '@/lib/docs';

export default function Sidebar() {
  const pathname = usePathname();
  const categories = getAllCategories();

  return (
    <aside className="w-64 glass border-r border-[#1E293B] h-screen sticky top-24 overflow-y-auto">
      <div className="p-4">
        <nav className="space-y-6">
          {categories.map(category => (
            <div key={category}>
              <h3 className="text-sm font-semibold text-[#F1F5F9] mb-2 uppercase tracking-wide">
                {category}
              </h3>
              <ul className="space-y-1">
                {getDocsByCategory(category).map((doc: DocMetadata) => (
                  <li key={doc.slug}>
                    <Link
                      href={`/docs/${doc.slug}`}
                      className={`block px-3 py-2 rounded-lg text-sm transition-all duration-200 cursor-pointer ${
                        pathname === `/docs/${doc.slug}`
                          ? 'bg-[#3B82F6]/20 text-[#3B82F6] font-medium'
                          : 'text-[#CBD5E1] hover:bg-[#3B82F6]/10 hover:text-[#3B82F6]'
                      }`}
                    >
                      {doc.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>
    </aside>
  );
}
