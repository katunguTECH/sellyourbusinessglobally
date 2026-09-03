import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    console.log('💾 Saving lead:', body.fullName || body.email)

    // Validate required fields
    if (!body.email && !body.fullName) {
      return NextResponse.json(
        { error: 'Email or Name is required' },
        { status: 400 }
      )
    }

    // Check if lead already exists (by email or name+company)
    const existingLead = await prisma.lead.findFirst({
      where: {
        OR: [
          { email: body.email },
          { 
            AND: [
              { fullName: body.fullName },
              { company: body.company }
            ]
          }
        ]
      }
    })

    if (existingLead) {
      return NextResponse.json({
        success: true,
        lead: existingLead,
        message: 'Lead already saved in database! 📁',
        alreadyExists: true
      })
    }

    // Save lead to database
    const lead = await prisma.lead.create({
      data: {
        firstName: body.firstName || '',
        lastName: body.lastName || '',
        fullName: body.fullName || '',
        email: body.email || '',
        phone: body.phone || '',
        whatsapp: body.whatsapp || '',
        company: body.company || '',
        title: body.title || '',
        industry: body.industry || '',
        location: body.location || '',
        website: body.website || '',
        linkedin: body.linkedin || '',
        twitter: body.twitter || '',
        score: body.score || 0,
        source: body.source || 'manual',
        status: 'new',
        userId: body.userId || 'demo-user-id',
        notes: body.notes || '',
      }
    })

    console.log('✅ Lead saved successfully:', lead.id)

    return NextResponse.json({
      success: true,
      lead: lead,
      message: 'Lead saved successfully! ✅'
    })

  } catch (error: any) {
    console.error('❌ Save error:', error.message)
    return NextResponse.json(
      { error: 'Failed to save lead: ' + error.message },
      { status: 500 }
    )
  }
}