import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

const apolloClient = axios.create({
  baseURL: 'https://api.apollo.io/api/v1',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': process.env.APOLLO_API_KEY!
  }
})

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q') || ''
    const location = searchParams.get('location') || ''
    const limit = parseInt(searchParams.get('limit') || '20')

    // Fallback mock data if Apollo fails
    const mockApolloLeads = [
      {
        id: 'apollo-1',
        fullName: 'Alice Johnson',
        company: 'CloudTech Solutions',
        title: 'CEO',
        industry: 'Technology',
        location: 'San Francisco, USA',
        email: 'alice@cloudtech.com',
        phone: '+1-555-1001',
        linkedin: 'https://linkedin.com/in/alicejohnson',
        score: 94,
        source: 'Apollo.io',
        isVerified: true
      },
      {
        id: 'apollo-2',
        fullName: 'Bob Williams',
        company: 'DataFlow Systems',
        title: 'Founder',
        industry: 'Software',
        location: 'Austin, USA',
        email: 'bob@dataflow.com',
        phone: '+1-555-1002',
        linkedin: 'https://linkedin.com/in/bobwilliams',
        score: 88,
        source: 'Apollo.io',
        isVerified: true
      },
      {
        id: 'apollo-3',
        fullName: 'Carol Chen',
        company: 'Innovation Labs',
        title: 'CTO',
        industry: 'Technology',
        location: 'Boston, USA',
        email: 'carol@innovation.com',
        phone: '+1-555-1003',
        linkedin: 'https://linkedin.com/in/carolchen',
        score: 91,
        source: 'Apollo.io',
        isVerified: false
      }
    ]

    // Try Apollo API first
    try {
      const response = await apolloClient.post('/mixed_companies/search', {
        q_organization_keyword_tags: [query],
        organization_locations: location ? [location] : undefined,
        page: 1,
        per_page: limit
      })

      const companies = response.data.organizations || []
      
      if (companies.length > 0) {
        // Format Apollo leads
        const formattedLeads = companies.slice(0, limit).map((c: any) => ({
          id: c.id || `apollo-${Math.random().toString(36).substring(7)}`,
          fullName: c.name || 'Unknown',
          company: c.name || '',
          title: 'Decision Maker',
          industry: c.industry || '',
          location: [c.city, c.state, c.country].filter(Boolean).join(', '),
          email: c.primary_domain ? `contact@${c.primary_domain}` : '',
          phone: '',
          linkedin: c.linkedin_url || '',
          score: 75 + Math.floor(Math.random() * 20),
          source: 'Apollo.io',
          isVerified: false
        }))

        return NextResponse.json({
          leads: formattedLeads,
          source: 'apollo',
          total: formattedLeads.length,
          message: `Found ${formattedLeads.length} leads from Apollo`
        })
      }
    } catch (apolloError) {
      console.log('Apollo API error, using mock data:', apolloError)
    }

    // Return mock data if Apollo fails
    return NextResponse.json({
      leads: mockApolloLeads,
      source: 'mock',
      total: mockApolloLeads.length,
      message: 'Using mock data (Apollo API unavailable)'
    })

  } catch (error) {
    console.error('Apollo search error:', error)
    return NextResponse.json(
      { error: 'Failed to search leads', leads: [] },
      { status: 500 }
    )
  }
}