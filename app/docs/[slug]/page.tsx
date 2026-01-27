import { notFound } from 'next/navigation';
import { getDocBySlug, getAllDocs } from '@/lib/docs';
import { processMarkdown, getMarkdownFile, type TableOfContentsItem } from '@/lib/markdown';
import { getVideoConfig } from '@/lib/video-mappings';
import Sidebar from '@/components/Sidebar';
import TableOfContents from '@/components/TableOfContents';
import RemotionPlayer from '@/components/RemotionPlayer';

export async function generateStaticParams() {
  const docs = getAllDocs();
  return docs.map((doc) => ({
    slug: doc.slug,
  }));
}

export default async function DocPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const doc = getDocBySlug(slug);

  if (!doc) {
    notFound();
  }

  const filePath = getMarkdownFile(doc.file);
  let html = '';
  let toc: TableOfContentsItem[] = [];

  try {
    const result = await processMarkdown(filePath);
    html = result.html;
    toc = result.toc;
  } catch (error) {
    console.error('Error loading document:', error);
    notFound();
  }

  // 获取视频配置
  const videoConfig = doc.videoSlug ? getVideoConfig(doc.videoSlug) : null;

  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <article className="prose prose-lg dark:prose-invert max-w-none">
          <header className="mb-10">
            <h1 className="text-4xl md:text-5xl font-bold text-[#F1F5F9] mb-6">
              {doc.title}
            </h1>
            <div className="flex items-center gap-4 mb-8">
              <span className="px-4 py-1.5 bg-[#3B82F6]/20 text-[#3B82F6] rounded-full text-sm font-medium">
                {doc.category}
              </span>
            </div>
            
            {/* 视频演示 - 重要模块在顶部显示 */}
            {videoConfig && videoConfig.showInHeader && (
              <div className="mb-10">
                <RemotionPlayer
                  compositionId={videoConfig.compositionId}
                  width={videoConfig.width}
                  height={videoConfig.height}
                  durationInFrames={videoConfig.durationInFrames}
                  fps={videoConfig.fps}
                  className="w-full"
                />
              </div>
            )}
          </header>
          
          {/* 视频演示 - 非重要模块在内容区域顶部显示 */}
          {videoConfig && !videoConfig.showInHeader && (
            <div className="mb-8">
              <RemotionPlayer
                compositionId={videoConfig.compositionId}
                width={videoConfig.width}
                height={videoConfig.height}
                durationInFrames={videoConfig.durationInFrames}
                fps={videoConfig.fps}
                className="w-full"
              />
            </div>
          )}
          
          <div
            className="markdown-content glass-card rounded-2xl p-8 md:p-12"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </article>
      </main>
      <TableOfContents items={toc} />
    </div>
  );
}
