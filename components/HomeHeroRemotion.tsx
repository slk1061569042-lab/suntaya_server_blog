"use client";

import dynamic from 'next/dynamic';

const RemotionPlayer = dynamic(() => import('@/components/RemotionPlayer'), {
  ssr: false,
});

export default function HomeHeroRemotion() {
  return (
    <section className="relative py-8 md:py-12 lg:py-16 overflow-hidden">
      {/* Remotion 区域只在客户端渲染，忽略 SSR/CSR 细微差异 */}
      <div suppressHydrationWarning>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Remotion 动画背景 */}
          <div className="relative w-full" style={{ minHeight: '400px' }}>
            <RemotionPlayer
              compositionId="git-hero-demo"
              width={1280}
              height={600}
              durationInFrames={900}
              fps={30}
              autoPlay={true}
              persistKey="hero"
              className="w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

