import { NextRequest, NextResponse } from 'next/server'

let mockCampaigns = [
  {
    id: '1',
    name: 'Tech Outreach Q4 2024',
    description: 'Reaching out to technology companies for partnerships',
    status: 'active',
    subject: 'Grow your tech business with our solution',
    content: 'Hi {{name}},\n\nI hope this email finds you well...',
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
    content: 'Dear {{name}},\n\nI\'m reaching out to discuss...',
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

export async function GET() {
  return NextResponse.json({ campaigns: mockCampaigns })
}

export async function POST(request: NextRequest) {
  const body = await request.json()

  const newCampaign = {
    id: String(mockCampaigns.length + 1),
    name: body.name || 'Untitled Campaign',
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

  return NextResponse.json({ success: true, campaign: newCampaign })
}