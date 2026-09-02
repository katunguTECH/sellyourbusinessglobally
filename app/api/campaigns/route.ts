import { NextRequest, NextResponse } from 'next/server'

// Mock campaigns data for testing
let mockCampaigns = [
  {
    id: '1',
    name: 'Tech Outreach Q4 2024',
    description: 'Reaching out to technology companies for partnerships',
    status: 'active',
    subject: 'Grow your tech business with our solution',
    content: 'Hi {{name}},\n\nI hope this email finds you well. I wanted to reach out because...',
    senderName: 'John Doe',
    senderEmail: 'john@sellyourbusinessglobally.com',
    sentCount: 245,
    openCount: 89,
    clickCount: 34,
    replyCount: 12,
    createdAt: new Date().toISOString(),
    leads: []
  },
  {
    id: '2',
    name: 'Healthcare Industry Connect',
    description: 'Connecting with healthcare decision makers',
    status: 'draft',
    subject: 'Revolutionizing healthcare with AI',
    content: 'Dear {{name}},\n\nI\'m reaching out to discuss how we can help...',
    senderName: 'Jane Smith',
    senderEmail: 'jane@sellyourbusinessglobally.com',
    sentCount: 0,
    openCount: 0,
    clickCount: 0,
    replyCount: 0,
    createdAt: new Date().toISOString(),
    leads: []
  }
]

// GET - Fetch all campaigns
export async function GET() {
  try {
    return NextResponse.json({ campaigns: mockCampaigns })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch campaigns' },
      { status: 500 }
    )
  }
}

// POST - Create a new campaign
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const newCampaign = {
      id: String(mockCampaigns.length + 1),
      name: body.name,
      description: body.description || '',
      status: 'draft',
      subject: body.subject || '',
      content: body.content || '',
      senderName: body.senderName || '',
      senderEmail: body.senderEmail || '',
      sentCount: 0,
      openCount: 0,
      clickCount: 0,
      replyCount: 0,
      createdAt: new Date().toISOString(),
      leads: []
    }

    mockCampaigns.push(newCampaign)

    return NextResponse.json({
      success: true,
      campaign: newCampaign,
      message: 'Campaign created successfully! 🎉'
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create campaign' },
      { status: 500 }
    )
  }
}