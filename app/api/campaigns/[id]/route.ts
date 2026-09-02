import { NextRequest, NextResponse } from 'next/server'

// Mock data (same as above)
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

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const campaign = mockCampaigns.find(c => c.id === params.id)

    if (!campaign) {
      return NextResponse.json(
        { error: 'Campaign not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ campaign })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch campaign' },
      { status: 500 }
    )
  }
}