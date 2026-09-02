import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'
import { findEmail, verifyEmail } from '@/lib/services/hunter'
import { getZooqProfile, getZooqCompany } from '@/lib/services/zooq'

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
    const industry = searchParams.get('industry') || ''
    const location = searchParams.get('location') || ''
    const enrich = searchParams.get('enrich') === 'true'
    const limit = parseInt(searchParams.get('limit') || '10')

    console.log('🚀 Complete Lead Search:', { query, industry, location, enrich })

    // Step 1: Search companies (Apollo - FREE)
    let companies = []
    try {
      const companyResponse = await apolloClient.post('/mixed_companies/search', {
        q_organization_keyword_tags: query ? [query] : (industry ? [industry] : undefined),
        organization_locations: location ? [location] : undefined,
        organization_num_employees_ranges: ["1,1000"],
        page: 1,
        per_page: limit
      })
      companies = companyResponse.data.organizations || []
      console.log(`✅ Found ${companies.length} companies`)
    } catch (error: any) {
      console.error('Company search error:', error.response?.data || error.message)
    }

    if (companies.length === 0) {
      return NextResponse.json({
        leads: [],
        source: 'complete',
        message: 'No companies found. Try a different search term.'
      })
    }

    // Step 2: Get decision makers (Apollo - FREE)
    const domains = companies
      .map((c: any) => c.primary_domain)
      .filter(Boolean)

    let people = []
    if (domains.length > 0) {
      try {
        const peopleResponse = await apolloClient.post('/mixed_people/api_search', {
          q_organization_domains_list: domains.slice(0, 10),
          person_titles: ['CEO', 'Founder', 'President', 'Owner', 'Managing Director'],
          person_seniorities: ['c_suite', 'founder', 'owner'],
          include_similar_titles: true,
          page: 1,
          per_page: limit
        })
        people = peopleResponse.data.people || []
        console.log(`✅ Found ${people.length} decision makers`)
      } catch (error: any) {
        console.error('People search error:', error.response?.data || error.message)
      }
    }

    // Step 3: Enrich with Hunter and Zooq
    const enrichedLeads = await Promise.all(
      people.map(async (person: any) => {
        const org = person.organization || {}
        const emails = person.contact_emails || []
        const phones = person.contact_phones || []
        
        let lead = {
          id: person.id || `complete-${Math.random().toString(36).substring(7)}`,
          firstName: person.first_name || '',
          lastName: person.last_name || '',
          fullName: person.name || `${person.first_name || ''} ${person.last_name || ''}`.trim(),
          email: emails.length > 0 ? emails[0].email : '',
          phone: phones.length > 0 ? phones[0].number : '',
          company: org.name || '',
          domain: org.primary_domain || '',
          title: person.title || '',
          industry: org.industry || '',
          location: [org.city, org.state, org.country].filter(Boolean).join(', '),
          linkedin: person.linkedin_url || '',
          linkedinProfile: null as any,
          companyData: null as any,
          score: 0,
          isVerified: false,
          hunterEmail: null as any,
          source: 'Apollo + Hunter + Zooq'
        }

        // Enrich with Zooq (LinkedIn)
        if (enrich && lead.linkedin) {
          try {
            const zooqProfile = await getZooqProfile(lead.linkedin)
            if (zooqProfile) {
              lead.linkedinProfile = zooqProfile
              lead.location = zooqProfile.location || lead.location
              // Get company data if we have the company LinkedIn URL
              if (zooqProfile.experience && zooqProfile.experience.length > 0) {
                const currentCompany = zooqProfile.experience.find((exp: any) => exp.current)
                if (currentCompany && currentCompany.companyUrl) {
                  const companyData = await getZooqCompany(currentCompany.companyUrl)
                  if (companyData) {
                    lead.companyData = companyData
                    lead.industry = companyData.industry || lead.industry
                  }
                }
              }
            }
          } catch (e) {
            console.log('Zooq enrichment skipped for:', lead.fullName)
          }
        }

        // Enrich with Hunter (Email)
        if (lead.domain && (lead.firstName || lead.lastName)) {
          try {
            const hunterResult = await findEmail({
              domain: lead.domain,
              first_name: lead.firstName,
              last_name: lead.lastName
            })

            if (hunterResult && hunterResult.email) {
              lead.hunterEmail = hunterResult
              lead.email = hunterResult.email
              lead.score = Math.round(hunterResult.score * 100)

              // Verify email
              try {
                const verification = await verifyEmail(hunterResult.email)
                if (verification) {
                  lead.isVerified = verification.status === 'valid'
                  if (verification.score > lead.score) {
                    lead.score = Math.round(verification.score)
                  }
                }
              } catch (verifyError) {
                console.log('Verification failed for:', hunterResult.email)
              }
            }
          } catch (e) {
            console.log('Hunter enrichment skipped for:', lead.fullName)
          }
        }

        return lead
      })
    )

    return NextResponse.json({
      success: true,
      source: 'complete',
      companiesFound: companies.length,
      leads: enrichedLeads,
      total: enrichedLeads.length,
      verifiedCount: enrichedLeads.filter((l: any) => l.isVerified).length,
      enrichedCount: enrichedLeads.filter((l: any) => l.linkedinProfile).length,
      message: `Found ${enrichedLeads.length} decision makers with full enrichment`
    })

  } catch (error: any) {
    console.error('Complete search error:', error.message)
    return NextResponse.json(
      { 
        error: 'Search failed', 
        details: error.message,
        leads: [],
        success: false
      },
      { status: 500 }
    )
  }
}