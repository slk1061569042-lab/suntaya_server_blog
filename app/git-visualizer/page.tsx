'use client';

import { useEffect } from 'react';
import GitFlowDiagram from '@/components/GitFlowDiagram';

export default function GitVisualizerPage() {
  useEffect(() => {
    // 隐藏导航栏
    const nav = document.querySelector('nav');
    if (nav) {
      nav.style.display = 'none';
    }
    
    return () => {
      // 恢复导航栏（当离开页面时）
      const nav = document.querySelector('nav');
      if (nav) {
        nav.style.display = '';
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-0">
      <GitFlowDiagram />
    </div>
  );
}
