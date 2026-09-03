import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const leads = body.leads || []

    if (leads.length === 0) {
      return NextResponse.json(
        { error: 'No leads to export' },
        { status: 400 }
      )
    }

    const headers = [
      'Full Name', 'Email', 'Phone', 'WhatsApp', 'Company',
      'Title', 'Industry', 'Location', 'Website', 'LinkedIn', 'Score', 'Source'
    ]

    const rows = leads.map((lead: any) => [
      lead.fullName || '',
      lead.email || '',
      lead.phone || '',
      lead.whatsapp || '',
      lead.company || '',
      lead.title || '',
      lead.industry || '',
      lead.location || '',
      lead.website || '',
      lead.linkedin || '',
      lead.score || '',
      lead.source || ''
    ])

    let csv = headers.join(',') + '\n'
    rows.forEach(row => {
      csv += row.map(cell => `"${cell}"`).join(',') + '\n'
    })

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename=leads-${new Date().toISOString().split('T')[0]}.csv`
      }
    })

  } catch (error) {
    console.error('Export error:', error)
    return NextResponse.json(
      { error: 'Failed to export leads' },
      { status: 500 }
    )
  }
}