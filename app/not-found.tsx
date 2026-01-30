import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
      <div className="text-center glass-card rounded-2xl p-12 max-w-md">
        <h1 className="text-5xl font-bold text-[#0F172A] mb-4">
          404
        </h1>
        <p className="text-xl text-[#475569] mb-8">
          抱歉，您访问的页面不存在。
        </p>
        <Link
          href="/"
          className="inline-block px-8 py-4 bg-[#F97316] hover:bg-[#EA580C] text-white rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 cursor-pointer"
        >
          返回首页
        </Link>
      </div>
    </div>
  );
}
