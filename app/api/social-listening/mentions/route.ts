import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  const userId = session?.user?.id
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

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