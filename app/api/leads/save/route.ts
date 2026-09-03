import { NextRequest, NextResponse } from 'next/server'

// In-memory storage for demo
let savedLeads: any[] = []

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    console.log('💾 Saving lead:', body.fullName || body.email)

    if (!body.email && !body.fullName) {
      return NextResponse.json(
        { error: 'Email or Name is required' },
        { status: 400 }
      )
    }

    const userId = body.userId || 'demo-user-id'

    const existingLead = savedLeads.find(
      (lead) => lead.email === body.email && lead.userId === userId
    )

    if (existingLead) {
      return NextResponse.json({
        success: true,
        lead: existingLead,
        message: 'Lead already saved!',
        alreadyExists: true
      })
    }

    const newLead = {
      id: `lead_${Date.now()}`,
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
      score: body.score || 0,
      source: body.source || 'manual',
      status: 'new',
      userId: userId,
      createdAt: new Date().toISOString(),
    }

    savedLeads.push(newLead)
    console.log('✅ Lead saved successfully:', newLead.id)

    return NextResponse.json({
      success: true,
      lead: newLead,
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

export async function GET() {
  return NextResponse.json({
    success: true,
    leads: savedLeads,
    total: savedLeads.length
  })
}