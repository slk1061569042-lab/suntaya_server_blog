export interface DocMetadata {
  slug: string;
  title: string;
  description: string;
  category: string;
  file: string;
  order?: number;
  videoSlug?: string; // 对应的视频配置 slug（在 video-mappings.ts 中定义）
}

export const gitDocs: DocMetadata[] = [
  {
    slug: 'quick-solutions',
    title: 'Git 快速解决方案',
    description: '常见问题的快速解决方案，包含冲突解决、暂存区操作、Pull/Push 等核心操作',
    category: '基础',
    file: '快速解决方案.md',
    order: 0
  },
  {
    slug: 'faq',
    title: '常见问题 FAQ',
    description: '最常被问到的 Git 问题，快速找到答案',
    category: '基础',
    file: '常见问题FAQ.md',
    order: 0.5
  },
  {
    slug: 'git-conflict-resolution',
    title: 'Git 冲突解决完全指南',
    description: '详细的 Git 冲突解决教程，包含冲突原理、解决步骤、常见错误和最佳实践',
    category: '基础',
    file: 'Git冲突解决完全指南.md',
    order: 1,
    videoSlug: 'git-conflict-resolution'
  },
  {
    slug: 'git-workflow',
    title: 'Git 工作流程完全解析',
    description: 'Commit、Push、分支合并详解，理解 Git 的完整工作流程',
    category: '基础',
    file: 'Git工作流程完全解析.md',
    order: 2,
    videoSlug: 'git-workflow'
  },
  {
    slug: 'commit-files',
    title: 'Commit 时包含哪些文件',
    description: '理解 Commit 时哪些文件会被提交，暂存区和工作区的关系',
    category: '基础',
    file: 'Commit时包含哪些文件.md',
    order: 3,
    videoSlug: 'commit-files'
  },
  {
    slug: 'staging-area',
    title: '暂存区详解',
    description: '深入理解暂存区的作用、存储方式和数据维护',
    category: '进阶',
    file: '暂存区详解.md',
    order: 4,
    videoSlug: 'staging-area'
  },
  {
    slug: 'staging-area-maintenance',
    title: '暂存区数据维护指南',
    description: '如何维护暂存区中的数据，不想提交的文件如何处理',
    category: '进阶',
    file: '暂存区数据维护指南.md',
    order: 5,
    videoSlug: 'staging-area-maintenance'
  },
  {
    slug: 'staging-area-relationship',
    title: '暂存区和工作区的关系',
    description: '理解暂存区和工作区的区别，为什么暂存区是快照而不是引用',
    category: '进阶',
    file: '暂存区和工作区的关系.md',
    order: 6,
    videoSlug: 'staging-area-relationship'
  },
  {
    slug: 'why-staging-area',
    title: '为什么需要暂存区',
    description: '暂存区的设计理念，为什么 Git 需要这个"复杂"的设计',
    category: '进阶',
    file: '为什么需要暂存区.md',
    order: 7,
    videoSlug: 'why-staging-area'
  },
  {
    slug: 'pull-update',
    title: 'Pull 后如何更新本地代码',
    description: 'Pull 操作后如何让本地代码变为最新，处理冲突的方法',
    category: '基础',
    file: 'Pull后如何更新本地代码.md',
    order: 8,
    videoSlug: 'pull-update'
  },
  {
    slug: 'no-pull-commit',
    title: '不 Pull 直接提交会发生什么',
    description: '不 Pull 直接提交的后果，为什么总是先 Pull 再 Push',
    category: '基础',
    file: '不pull直接提交会发生什么.md',
    order: 9,
    videoSlug: 'no-pull-commit'
  },
  {
    slug: 'staging-conflict',
    title: '暂存区有冲突代码怎么办',
    description: 'Pull 后暂存区有冲突代码的处理方法',
    category: '进阶',
    file: '暂存区有冲突代码怎么办.md',
    order: 10,
    videoSlug: 'staging-conflict'
  },
  {
    slug: 'staging-conflict-details',
    title: '暂存区冲突的实际情况',
    description: '深入理解暂存区冲突的实际情况，Pull 前后的状态变化',
    category: '进阶',
    file: '暂存区冲突的实际情况.md',
    order: 11,
    videoSlug: 'staging-conflict-details'
  },
  {
    slug: 'understand-conflict-sides',
    title: '理解冲突中的左右版本',
    description: '如何判断冲突中哪个版本是你的代码，哪个是服务器上的代码',
    category: '基础',
    file: '理解冲突中的左右版本.md',
    order: 12,
    videoSlug: 'understand-conflict-sides'
  },
  {
    slug: 'manual-resolve',
    title: '手动解决冲突步骤',
    description: '没有按钮时如何手动解决冲突，详细的操作步骤',
    category: '基础',
    file: '手动解决冲突步骤.md',
    order: 13,
    videoSlug: 'manual-resolve'
  },
  {
    slug: 'conflict-checklist',
    title: '解决冲突的检查清单',
    description: '冲突解决的快速检查清单，确保不会遗漏步骤',
    category: '基础',
    file: '解决冲突的检查清单.md',
    order: 14,
    videoSlug: 'conflict-checklist'
  },
  {
    slug: 'staging-analogy',
    title: '暂存区类比修正和强制推送',
    description: '暂存区的准确类比，以及 Git 强制推送的作用和危险性',
    category: '进阶',
    file: '暂存区类比修正和强制推送.md',
    order: 15,
    videoSlug: 'staging-analogy'
  },
  {
    slug: 'filter-branch',
    title: 'filter-branch 和 filter-repo 的工作原理',
    description: '如何从 Git 历史中删除文件，filter-branch 和 filter-repo 的工作原理',
    category: '高级',
    file: 'filter-branch和filter-repo的工作原理.md',
    order: 16,
    videoSlug: 'filter-branch'
  },
  {
    slug: 'delete-remote-files',
    title: '删除远程服务器上的文件',
    description: '如何删除已提交到远程的文件，正常删除和从历史中删除的区别',
    category: '高级',
    file: '删除远程服务器上的文件.md',
    order: 17,
    videoSlug: 'delete-remote-files'
  }
];

export function getDocBySlug(slug: string): DocMetadata | undefined {
  return gitDocs.find(doc => doc.slug === slug);
}

export function getDocsByCategory(category: string): DocMetadata[] {
  return gitDocs.filter(doc => doc.category === category).sort((a, b) => (a.order || 0) - (b.order || 0));
}

export function getAllCategories(): string[] {
  return Array.from(new Set(gitDocs.map(doc => doc.category)));
}

export function getAllDocs(): DocMetadata[] {
  return gitDocs.sort((a, b) => (a.order || 0) - (b.order || 0));
}
