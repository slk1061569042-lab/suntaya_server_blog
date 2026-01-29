import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

const SECRET = process.env.REVALIDATE_SECRET;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { secret, paths } = body as { secret?: string; paths?: string[] };

    if (!SECRET || secret !== SECRET) {
      return NextResponse.json({ ok: false, error: 'Invalid secret' }, { status: 401 });
    }

    const toRevalidate = paths && paths.length ? paths : ['/'];

    for (const p of toRevalidate) {
      revalidatePath(p);
    }

    return NextResponse.json({ ok: true, revalidated: toRevalidate });
  } catch (err) {
    console.error('Revalidate error', err);
    return NextResponse.json({ ok: false, error: 'Revalidate failed' }, { status: 500 });
  }
}

