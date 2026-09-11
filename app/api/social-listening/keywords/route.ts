import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

async function requireUserId(): Promise<string | null> {
  const session = await getServerSession(authOptions)
  return session?.user?.id ?? null
}

export async function GET() {
  const userId = await requireUserId()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const keywords = await prisma.keywordAlert.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { mentions: true } } },
  })

  return NextResponse.json({ keywords })
}

export async function POST(req: NextRequest) {
  const userId = await requireUserId()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json().catch(() => null)
  const keyword = String(body?.keyword ?? '').trim()
  if (!keyword || keyword.length > 120) {
    return NextResponse.json({ error: 'Invalid keyword' }, { status: 400 })
  }

  const rawSubs = Array.isArray(body?.subreddits) ? body.subreddits : []
  const subreddits = rawSubs
    .map((s: unknown) => String(s).trim().replace(/^\/?r\//i, ''))
    .filter(Boolean)
    .slice(0, 20)

  const created = await prisma.keywordAlert.create({
    data: {
      userId,
      keyword,
      platforms: 'reddit',
      subreddits,
    },
  })

  return NextResponse.json({ keyword: created }, { status: 201 })
}

export async function DELETE(req: NextRequest) {
  const userId = await requireUserId()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const id = new URL(req.url).searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

  const kw = await prisma.keywordAlert.findFirst({ where: { id, userId } })
  if (!kw) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  await prisma.socialMention.deleteMany({ where: { keywordAlertId: id } })
  await prisma.keywordAlert.delete({ where: { id } })

  return NextResponse.json({ ok: true })
}