import Link from 'next/link';
import { DocMetadata } from '@/lib/docs';

interface DocCardProps {
  doc: DocMetadata;
}

export default function DocCard({ doc }: DocCardProps) {
  return (
    <Link
      href={`/docs/${doc.slug}`}
      className="block glass-card rounded-2xl p-6 hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] cursor-pointer group"
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-semibold text-[#F1F5F9] group-hover:text-[#3B82F6] transition-colors duration-200">
          {doc.title}
        </h3>
        <span className="text-xs px-3 py-1 bg-[#3B82F6]/20 text-[#3B82F6] rounded-full font-medium whitespace-nowrap ml-2">
          {doc.category}
        </span>
      </div>
      <p className="text-[#CBD5E1] text-sm line-clamp-2 leading-relaxed">
        {doc.description}
      </p>
    </Link>
  );
}
