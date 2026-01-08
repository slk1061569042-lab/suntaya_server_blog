import { NextRequest, NextResponse } from 'next/server';
import { searchDocs } from '@/lib/search';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q') || '';

  if (!query.trim()) {
    return NextResponse.json({ results: [] });
  }

  const results = searchDocs(query);
  return NextResponse.json({ results });
}
