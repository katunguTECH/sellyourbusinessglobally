import { NextRequest, NextResponse } from 'next/server'

const mockLeads = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Smith',
    fullName: 'John Smith',
    email: 'john.smith@techcorp.com',
    phone: '+1-555-0101',
    whatsapp: '+1-555-0101',
    company: 'TechCorp Inc.',
    title: 'CEO & Founder',
    industry: 'Technology',
    location: 'New York, USA',
    website: 'https://techcorp.com',
    linkedin: 'https://linkedin.com/in/johnsmith',
    score: 95,
    source: 'Apollo'
  },
  {
    id: '2',
    firstName: 'Sarah',
    lastName: 'Johnson',
    fullName: 'Sarah Johnson',
    email: 'sarah.j@mediagroup.com',
    phone: '+1-555-0102',
    whatsapp: '+1-555-0102',
    company: 'Media Group LLC',
    title: 'Marketing Director',
    industry: 'Media & Entertainment',
    location: 'Los Angeles, USA',
    website: 'https://mediagroup.com',
    linkedin: 'https://linkedin.com/in/sarahjohnson',
    score: 88,
    source: 'LinkedIn'
  },
  {
    id: '3',
    firstName: 'Michael',
    lastName: 'Williams',
    fullName: 'Michael Williams',
    email: 'm.williams@retailcorp.com',
    phone: '+1-555-0103',
    company: 'Retail Corp',
    title: 'Founder',
    industry: 'Retail',
    location: 'Chicago, USA',
    website: 'https://retailcorp.com',
    linkedin: 'https://linkedin.com/in/michaelwilliams',
    score: 92,
    source: 'Hunter'
  }
]

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q') || ''

    let filtered = [...mockLeads]

    if (query) {
      const searchLower = query.toLowerCase()
      filtered = filtered.filter(lead =>
        lead.company.toLowerCase().includes(searchLower) ||
        lead.fullName.toLowerCase().includes(searchLower) ||
        lead.industry.toLowerCase().includes(searchLower) ||
        lead.location.toLowerCase().includes(searchLower) ||
        lead.title.toLowerCase().includes(searchLower)
      )
    }

    return NextResponse.json({
      leads: filtered,
      source: 'mock',
      total: filtered.length
    })

  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to search leads', leads: [] },
      { status: 500 }
    )
  }
}