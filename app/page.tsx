import Link from 'next/link';
import { getAllCategories, getDocsByCategory, getAllDocs } from '@/lib/docs';
import DocCard from '@/components/DocCard';

export default function HomePage() {
  const categories = getAllCategories();
  const featuredDocs = getAllDocs().slice(0, 6);

  return (
    <div className="min-h-screen bg-[#0A0E1A]">
      {/* Hero Section - Git 可视化学习入口 */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        {/* Background gradient - 暗色玻璃风格 */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#2563EB]/20 via-[#3B82F6]/15 to-[#F97316]/20"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-[#F1F5F9] mb-6 leading-tight">
              Git 完整学习指南
            </h1>
            <p className="text-xl md:text-2xl text-[#CBD5E1] mb-10 max-w-3xl mx-auto leading-relaxed">
              通过交互式可视化学习 Git 命令，掌握工作区、暂存区、本地仓库和远程仓库之间的数据流转
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/git-visualizer"
                className="px-8 py-4 bg-[#F97316] hover:bg-[#EA580C] text-white rounded-xl font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 cursor-pointer"
              >
                开始可视化练习 →
              </Link>
              <Link
                href="/docs"
                className="px-8 py-4 glass-card text-[#3B82F6] rounded-xl font-semibold text-lg transition-all duration-200 hover:shadow-lg cursor-pointer border border-[#3B82F6]/30 hover:border-[#3B82F6]/50"
              >
                查看所有文档
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Git 可视化预览卡片 */}
      <section className="py-12 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-card rounded-2xl p-8 md:p-12 relative overflow-hidden">
            {/* Background gradient - 暗色玻璃风格 */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#2563EB]/30 via-[#3B82F6]/20 to-[#F97316]/30"></div>
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-[#F1F5F9] mb-4">
                Git 命令可视化学习
              </h2>
              <p className="text-xl text-[#CBD5E1] mb-8 max-w-2xl">
                通过交互式动画学习 Git 命令及其参数，理解工作区、暂存区、本地仓库和远程仓库之间的数据流转。掌握基础命令链：add → commit → push → pull
              </p>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="glass-card rounded-xl p-4 border border-[#3B82F6]/30">
                  <div className="text-2xl font-bold text-[#3B82F6] mb-2">工作区</div>
                  <div className="text-sm text-[#CBD5E1]">git add -A</div>
                  <div className="text-sm text-[#CBD5E1]">git status</div>
                </div>
                <div className="glass-card rounded-xl p-4 border border-[#F97316]/30">
                  <div className="text-2xl font-bold text-[#F97316] mb-2">暂存区</div>
                  <div className="text-sm text-[#CBD5E1]">git commit -m</div>
                  <div className="text-sm text-[#CBD5E1]">git reset</div>
                </div>
                <div className="glass-card rounded-xl p-4 border border-[#10B981]/30">
                  <div className="text-2xl font-bold text-[#10B981] mb-2">本地仓库</div>
                  <div className="text-sm text-[#CBD5E1]">git log</div>
                  <div className="text-sm text-[#CBD5E1]">git reset --soft</div>
                </div>
                <div className="glass-card rounded-xl p-4 border border-[#8B5CF6]/30">
                  <div className="text-2xl font-bold text-[#8B5CF6] mb-2">远程仓库</div>
                  <div className="text-sm text-[#CBD5E1]">git push</div>
                  <div className="text-sm text-[#CBD5E1]">git pull</div>
                </div>
              </div>
              <Link
                href="/git-visualizer"
                className="inline-block px-8 py-4 bg-[#F97316] hover:bg-[#EA580C] text-white rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 cursor-pointer"
              >
                进入全屏练习模式 →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Docs */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-[#F1F5F9] mb-12 text-center">精选文档</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredDocs.map((doc) => (
              <DocCard key={doc.slug} doc={doc} />
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-[#F1F5F9] mb-12 text-center">按分类浏览</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => {
              const docs = getDocsByCategory(category);
              return (
                <div key={category} className="glass-card rounded-2xl p-6 hover:shadow-xl transition-all duration-200 cursor-pointer">
                  <h3 className="text-xl font-semibold text-[#F1F5F9] mb-4">
                    {category}
                  </h3>
                  <ul className="space-y-2">
                    {docs.slice(0, 5).map((doc) => (
                      <li key={doc.slug}>
                        <Link
                          href={`/docs/${doc.slug}`}
                          className="text-[#CBD5E1] hover:text-[#3B82F6] transition-colors duration-200 block"
                        >
                          {doc.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                  {docs.length > 5 && (
                    <Link
                      href="/docs"
                      className="text-[#3B82F6] text-sm mt-4 inline-block hover:underline font-medium"
                    >
                      查看全部 ({docs.length})
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
