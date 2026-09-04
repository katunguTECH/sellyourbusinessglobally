import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Use the new route segment config
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Email webhook received:', body);
    
    const { from, to, subject, text, html, headers } = body;

    const leadIdMatch = subject?.match(/\[LEAD-([a-zA-Z0-9-]+)\]/);
    if (!leadIdMatch) {
      console.log('No lead ID found in subject');
      return NextResponse.json({ received: true });
    }
    const leadId = leadIdMatch[1];

    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .select('id, name, company, status')
      .eq('id', leadId)
      .single();

    if (leadError || !lead) {
      console.log('Lead not found:', leadId);
      return NextResponse.json({ received: true });
    }

    const analysis = analyzeReply(text || html || '');

    const { error } = await supabase
      .from('email_replies')
      .insert({
        lead_id: leadId,
        from_email: from,
        subject: subject || 'No subject',
        body: text || html || '',
        sentiment: analysis.sentiment || 'neutral',
        category: analysis.category || 'neutral',
        needs_response: analysis.needsResponse || false,
        received_at: new Date().toISOString(),
        status: 'unread',
      });

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    await updateLeadStatus(leadId, analysis);

    console.log('Email reply stored for lead:', leadId);
    return NextResponse.json({ received: true, leadId, analysis });

  } catch (error) {
    console.error('Email webhook error:', error);
    return NextResponse.json({ error: 'Webhook error' }, { status: 500 });
  }
}

function analyzeReply(text: string) {
  const lowerText = text.toLowerCase();
  
  const interested = ['interested', 'yes', 'sure', 'would like', 'tell me more', 'available', 'call', 'meeting', 'discuss'];
  const notInterested = ['not interested', 'no thanks', 'pass', 'not for us', 'no thank you'];
  const questions = ['how', 'what', 'when', 'where', 'why', 'who', '?'];
  
  let category = 'neutral';
  let sentiment = 'neutral';
  
  if (interested.some(word => lowerText.includes(word))) {
    category = 'interested';
    sentiment = 'positive';
  } else if (notInterested.some(word => lowerText.includes(word))) {
    category = 'not_interested';
    sentiment = 'negative';
  } else if (questions.some(word => lowerText.includes(word))) {
    category = 'question';
    sentiment = 'neutral';
  }
  
  return {
    category,
    sentiment,
    needsResponse: category !== 'not_interested',
  };
}

async function updateLeadStatus(leadId: string, analysis: any) {
  let status = 'active';
  switch (analysis.category) {
    case 'interested': 
      status = 'warm'; 
      break;
    case 'not_interested': 
      status = 'cold'; 
      break;
    case 'question': 
      status = 'active'; 
      break;
    default: 
      status = 'active';
  }
  
  await supabase
    .from('leads')
    .update({ 
      status, 
      last_contact: new Date().toISOString() 
    })
    .eq('id', leadId);
}