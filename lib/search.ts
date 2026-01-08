import Fuse from 'fuse.js';
import { gitDocs, DocMetadata } from './docs';

export interface SearchResult extends DocMetadata {
  score?: number;
}

const fuseOptions = {
  keys: ['title', 'description', 'category'],
  threshold: 0.3,
  includeScore: true,
};

let fuse: Fuse<DocMetadata> | null = null;

function getFuseInstance(): Fuse<DocMetadata> {
  if (!fuse) {
    fuse = new Fuse(gitDocs, fuseOptions);
  }
  return fuse;
}

export function searchDocs(query: string): SearchResult[] {
  if (!query.trim()) {
    return [];
  }

  const fuseInstance = getFuseInstance();
  const results = fuseInstance.search(query);

  return results.map(result => ({
    ...result.item,
    score: result.score,
  }));
}

export function getAllDocsForSearch(): DocMetadata[] {
  return gitDocs;
}
