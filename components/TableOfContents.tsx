'use client';

import { TableOfContentsItem } from '@/lib/markdown';
import { useEffect, useState } from 'react';

interface TableOfContentsProps {
  items: TableOfContentsItem[];
}

export default function TableOfContents({ items }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0% -35% 0%' }
    );

    items.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  return (
    <div className="hidden lg:block w-64 pl-8">
      <div className="sticky top-24">
        <div className="glass-card rounded-xl p-4">
          <h3 className="text-sm font-semibold text-[#0F172A] mb-4 uppercase tracking-wide">目录</h3>
          <nav className="space-y-1">
            {items.map((item, index) => {
              // 确保 key 唯一：使用 id + index 的组合
              const uniqueKey = item.id || `toc-item-${index}`;
              return (
                <a
                  key={`${uniqueKey}-${index}`}
                  href={`#${item.id}`}
                  className={`block text-sm transition-all duration-200 rounded-lg px-2 py-1 ${
                    item.level === 1
                      ? 'pl-2 font-medium'
                      : item.level === 2
                      ? 'pl-6'
                      : 'pl-10'
                  } ${
                    activeId === item.id
                      ? 'text-[#3B82F6] bg-[#3B82F6]/20 font-medium'
                      : 'text-[#475569] hover:text-[#3B82F6] hover:bg-[#3B82F6]/10'
                  }`}
                >
                  {item.text}
                </a>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
}
