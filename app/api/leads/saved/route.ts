import { NextResponse } from 'next/server'

// Shared in-memory storage (same as save route)
let savedLeads: any[] = []

export async function GET() {
  return NextResponse.json({
    success: true,
    leads: savedLeads,
    total: savedLeads.length
  })
}