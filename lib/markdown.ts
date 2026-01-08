import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import { readFileSync } from 'fs';
import { join } from 'path';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import { unified } from 'unified';
import rehypeStringify from 'rehype-stringify';
import remarkRehype from 'remark-rehype';

export interface MarkdownContent {
  html: string;
  toc: TableOfContentsItem[];
}

export interface TableOfContentsItem {
  id: string;
  text: string;
  level: number;
}

// Helper function to generate slug (same as rehype-slug)
function slugify(text: string): string {
  if (!text) return '';
  
  let slug = text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')  // 移除所有非字母数字、空格、连字符的字符
    .replace(/\s+/g, '-')      // 将空格替换为连字符
    .replace(/-+/g, '-')       // 将多个连字符合并为一个
    .trim();
  
  // 移除开头和结尾的连字符
  slug = slug.replace(/^-+|-+$/g, '');
  
  return slug || '';
}

export async function processMarkdown(filePath: string): Promise<MarkdownContent> {
  const content = readFileSync(filePath, 'utf-8');
  
  // Extract TOC - use same slug generation as rehype-slug
  const toc: TableOfContentsItem[] = [];
  // 匹配标题：至少一个 #，后跟空格，再跟至少一个非空白字符
  const headingRegex = /^(#{1,6})\s+(.+)$/gm;
  let match;
  const idCounts = new Map<string, number>();
  
  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    
    // 跳过空标题或只包含空白字符的标题
    if (!text || text.length === 0) continue;
    
    let id = slugify(text);
    
    // 如果 id 为空或只有连字符，生成一个唯一的 id
    if (!id || id === '-' || /^-+$/.test(id)) {
      id = `heading-${toc.length}`;
    }
    
    // 处理重复的 id（rehype-slug 也会处理重复，所以我们需要保持一致）
    const count = idCounts.get(id) || 0;
    idCounts.set(id, count + 1);
    
    // 如果有重复，添加后缀（与 rehype-slug 的行为一致）
    const finalId = count > 0 ? `${id}-${count}` : id;
    
    toc.push({ id: finalId, text, level });
  }

  // Process markdown with code highlighting
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings, {
      behavior: 'append',
      properties: {
        className: ['anchor-link'],
        ariaLabel: '链接到标题',
      },
    })
    .use(rehypePrettyCode, {
      theme: {
        light: 'github-light',
        dark: 'github-dark',
      },
      keepBackground: false,
    })
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(content);

  const html = String(file);

  return { html, toc };
}

export function getMarkdownFile(docFile: string): string {
  return join(process.cwd(), 'content', 'git-docs', docFile);
}
