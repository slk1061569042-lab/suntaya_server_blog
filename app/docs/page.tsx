import { getAllDocs, getAllCategories, getDocsByCategory } from '@/lib/docs';
import DocCard from '@/components/DocCard';

export default function DocsPage() {
  const categories = getAllCategories();
  const allDocs = getAllDocs();

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-[#F1F5F9] mb-4">
            所有文档
          </h1>
          <p className="text-xl text-[#CBD5E1]">
            共 {allDocs.length} 篇文档，涵盖 Git 的各个方面
          </p>
        </div>

        {categories.map((category) => {
          const docs = getDocsByCategory(category);
          return (
            <div key={category} className="mb-16">
              <h2 className="text-2xl md:text-3xl font-semibold text-[#F1F5F9] mb-8">
                {category}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {docs.map((doc) => (
                  <DocCard key={doc.slug} doc={doc} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
