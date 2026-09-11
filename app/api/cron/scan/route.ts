import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { scanForUser } from '@/lib/social-listening-scan'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 300

export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET
  if (!secret) {
    return NextResponse.json(
      { error: 'CRON_SECRET not configured' },
      { status: 500 },
    )
  }

  const auth = req.headers.get('authorization')
  if (auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const users = await prisma.keywordAlert.findMany({
    where: { isActive: true },
    select: { userId: true },
    distinct: ['userId'],
  })

  const results: Array<{ userId: string; created: number; errors: number }> = []

  for (const { userId } of users) {
    try {
      const r = await scanForUser(userId)
      results.push({ userId, created: r.created, errors: r.errors.length })
    } catch (e) {
      results.push({ userId, created: 0, errors: 1 })
      console.error(`[cron] scan failed for user ${userId}:`, e)
    }
  }

  return NextResponse.json({
    ranAt: new Date().toISOString(),
    usersScanned: users.length,
    results,
  })
}