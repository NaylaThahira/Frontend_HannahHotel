import crypto from 'node:crypto';
import { revalidatePath, revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

function getRevalidateSecret(): string | null {
  const secret = process.env.REVALIDATE_SECRET;
  if (process.env.NODE_ENV === 'production') {
    if (!secret || secret.length < 32) return null;
    return secret;
  }
  return secret || 'hannah-hotel-revalidate-secret';
}

function isSecretValid(provided: string | null, expected: string | null): boolean {
  if (!provided || !expected) return false;
  const a = Buffer.from(provided, 'utf8');
  const b = Buffer.from(expected, 'utf8');
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

export async function POST(req: NextRequest) {
  const expectedSecret = getRevalidateSecret();
  const secret = req.headers.get('x-revalidate-secret');
  if (!isSecretValid(secret, expectedSecret)) {
    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 });
  }

  let body: { tags?: string[]; paths?: string[] } = {};
  try {
    body = await req.json();
  } catch {
    body = {};
  }

  const tags = Array.isArray(body.tags) && body.tags.length > 0
    ? body.tags
    : ['settings', 'branches', 'rooms', 'facilities', 'packages', 'galleries'];

  for (const tag of tags) {
    revalidateTag(tag, { expire: 0 });
  }

  revalidatePath('/', 'layout');

  return NextResponse.json({ revalidated: true, tags, now: Date.now() });
}

