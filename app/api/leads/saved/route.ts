import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const leads = await prisma.lead.findMany({
      where: {
        userId: 'demo-user-id' // We'll add auth later
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({
      success: true,
      leads: leads,
      total: leads.length
    })
  } catch (error: any) {
    console.error('Error fetching saved leads:', error.message)
    return NextResponse.json(
      { error: 'Failed to fetch saved leads' },
      { status: 500 }
    )
  }
}