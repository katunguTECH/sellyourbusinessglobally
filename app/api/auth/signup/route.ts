import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  const email = String(body?.email ?? '').toLowerCase().trim()
  const password = String(body?.password ?? '')
  const name = String(body?.name ?? '').trim() || null

  if (!email || !email.includes('@')) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
  }
  if (password.length < 8) {
    return NextResponse.json(
      { error: 'Password must be at least 8 characters' },
      { status: 400 },
    )
  }

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    return NextResponse.json(
      { error: 'An account with that email already exists' },
      { status: 409 },
    )
  }

  const hash = await bcrypt.hash(password, 12)
  const user = await prisma.user.create({
    data: { email, password: hash, name },
  })

  return NextResponse.json({ id: user.id, email: user.email }, { status: 201 })
}