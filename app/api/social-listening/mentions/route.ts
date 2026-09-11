import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { DEV_USER_ID } from '@/lib/dev-user'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const userId = DEV_USER_ID

  const url = new URL(req.url)
  const keywordId = url.searchParams.get('keywordId') ?? undefined
  const sentiment = url.searchParams.get('sentiment') ?? undefined
  const limit = Math.min(Number(url.searchParams.get('limit') ?? 50), 200)

  const mentions = await prisma.socialMention.findMany({
    where: {
      userId,
      ...(keywordId ? { keywordAlertId: keywordId } : {}),
      ...(sentiment ? { sentiment } : {}),
    },
    orderBy: [{ postedAt: 'desc' }],
    take: limit,
    include: { keywordAlert: { select: { keyword: true } } },
  })

  return NextResponse.json({ mentions })
}