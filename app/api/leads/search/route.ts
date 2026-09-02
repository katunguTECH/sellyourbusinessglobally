import { NextRequest, NextResponse } from 'next/server'

// Mock lead data for demonstration
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
  },
  {
    id: '4',
    firstName: 'Emily',
    lastName: 'Brown',
    fullName: 'Emily Brown',
    email: 'emily.b@healthtech.com',
    phone: '+1-555-0104',
    whatsapp: '+1-555-0104',
    company: 'HealthTech Solutions',
    title: 'CEO',
    industry: 'Healthcare',
    location: 'Boston, USA',
    website: 'https://healthtech.com',
    linkedin: 'https://linkedin.com/in/emilybrown',
    score: 90,
    source: 'Apollo'
  },
  {
    id: '5',
    firstName: 'David',
    lastName: 'Wilson',
    fullName: 'David Wilson',
    email: 'david.w@fintech.io',
    phone: '+1-555-0105',
    company: 'FinTech Innovations',
    title: 'CTO',
    industry: 'Finance',
    location: 'San Francisco, USA',
    website: 'https://fintech.io',
    linkedin: 'https://linkedin.com/in/davidwilson',
    score: 85,
    source: 'LinkedIn'
  },
  {
    id: '6',
    firstName: 'Lisa',
    lastName: 'Martinez',
    fullName: 'Lisa Martinez',
    email: 'lisa.m@edutech.com',
    phone: '+1-555-0106',
    whatsapp: '+1-555-0106',
    company: 'EduTech Solutions',
    title: 'Founder',
    industry: 'Education',
    location: 'Austin, USA',
    website: 'https://edutech.com',
    linkedin: 'https://linkedin.com/in/lisamartinez',
    score: 87,
    source: 'Hunter'
  }
]

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q') || ''
    const industry = searchParams.get('industry') || ''
    const location = searchParams.get('location') || ''

    console.log('Searching for:', { query, industry, location })

    // Filter mock leads based on search
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

    if (industry) {
      filtered = filtered.filter(lead =>
        lead.industry.toLowerCase().includes(industry.toLowerCase())
      )
    }

    if (location) {
      filtered = filtered.filter(lead =>
        lead.location.toLowerCase().includes(location.toLowerCase())
      )
    }

    console.log('Found', filtered.length, 'leads')

    return NextResponse.json({
      leads: filtered,
      source: 'mock',
      total: filtered.length
    })

  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json(
      { error: 'Failed to search leads', leads: [] },
      { status: 500 }
    )
  }
}