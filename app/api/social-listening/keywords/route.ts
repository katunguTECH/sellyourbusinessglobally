import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { DEV_USER_ID } from '@/lib/dev-user'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  const userId = DEV_USER_ID

  const keywords = await prisma.keywordAlert.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { mentions: true } } },
  })

  return NextResponse.json({ keywords })
}

export async function POST(req: NextRequest) {
  const userId = DEV_USER_ID

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
  const userId = DEV_USER_ID

  const id = new URL(req.url).searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

  const kw = await prisma.keywordAlert.findFirst({ where: { id, userId } })
  if (!kw) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  await prisma.socialMention.deleteMany({ where: { keywordAlertId: id } })
  await prisma.keywordAlert.delete({ where: { id } })

  return NextResponse.json({ ok: true })
}