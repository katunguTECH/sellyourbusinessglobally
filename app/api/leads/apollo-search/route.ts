import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

const apolloClient = axios.create({
  baseURL: 'https://api.apollo.io/api/v1',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': process.env.APOLLO_API_KEY!,
  },
})

const hunterClient = axios.create({
  baseURL: 'https://api.hunter.io/v2',
})

function looksLikeDomain(query: string): boolean {
  return /^[a-z0-9-]+(\.[a-z0-9-]+)+$/i.test(query.trim()) && !query.includes(' ')
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = (searchParams.get('q') || '').trim()
  const location = searchParams.get('location') || ''
  const limit = parseInt(searchParams.get('limit') || '20')

  if (!query) {
    return NextResponse.json({ error: 'Search query is required', leads: [] }, { status: 400 })
  }

  // Domain-style query (e.g. "worldtvchannel.online") -> Hunter Domain Search
  if (looksLikeDomain(query)) {
    try {
      const response = await hunterClient.get('/domain-search', {
        params: { domain: query, api_key: process.env.HUNTER_API_KEY, limit: Math.min(limit, 10) },
      })

      const emails = response.data?.data?.emails || []

      const leads = emails.map((e: any, i: number) => ({
        id: `hunter-${query}-${i}`,
        fullName: [e.first_name, e.last_name].filter(Boolean).join(' ') || 'Unknown',
        company: response.data?.data?.organization || query,
        title: e.position || 'N/A',
        industry: '',
        location: '',
        email: e.value,
        phone: e.phone_number || '',
        linkedin: e.linkedin || '',
        score: Math.round((e.confidence || 0)),
        source: 'Hunter.io',
        isVerified: e.verification?.status === 'valid',
      }))

      return NextResponse.json({
        leads,
        source: 'hunter',
        total: leads.length,
        message: leads.length
          ? `Found ${leads.length} real email(s) for ${query}`
          : `Hunter found no email addresses on file for ${query}. This domain may be too small or new for Hunter's index.`,
      })
    } catch (err: any) {
      const status = err.response?.status
      const detail = err.response?.data?.errors?.[0]?.details || err.message
      return NextResponse.json(
        { error: `Hunter API error (${status}): ${detail}`, leads: [] },
        { status: status || 500 }
      )
    }
  }

  // Otherwise: person/title/industry query -> Apollo People Search
  try {
    const response = await apolloClient.post('/mixed_people/search', {
      q_keywords: query,
      person_locations: location ? [location] : undefined,
      page: 1,
      per_page: limit,
    })

    const people = response.data?.people || []

    const leads = people.map((p: any) => ({
      id: p.id,
      fullName: p.name || [p.first_name, p.last_name].filter(Boolean).join(' ') || 'Unknown',
      company: p.organization?.name || '',
      title: p.title || 'N/A',
      industry: p.organization?.industry || '',
      location: [p.city, p.state, p.country].filter(Boolean).join(', '),
      email: '', // Apollo's search endpoint doesn't return emails without a separate enrichment call
      phone: '',
      linkedin: p.linkedin_url || '',
      score: 0,
      source: 'Apollo.io',
      isVerified: false,
    }))

    return NextResponse.json({
      leads,
      source: 'apollo',
      total: leads.length,
      message: leads.length
        ? `Found ${leads.length} people from Apollo. Note: emails require a separate enrichment step (uses Apollo credits) — not included here yet.`
        : `No people found for "${query}". Try a job title, industry, or company name.`,
    })
  } catch (err: any) {
    const status = err.response?.status
    const detail = err.response?.data?.error_message || err.response?.data?.message || err.message
    return NextResponse.json(
      { error: `Apollo API error (${status}): ${detail}`, leads: [] },
      { status: status || 500 }
    )
  }
}