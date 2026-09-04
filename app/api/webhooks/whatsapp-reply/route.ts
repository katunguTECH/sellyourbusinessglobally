import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const body = Object.fromEntries(formData);
    
    console.log('WhatsApp webhook received:', body);
    
    const { From, Body, MessageSid, ProfileName } = body;
    const phoneNumber = From.toString().replace('whatsapp:', '');

    const { data: lead, error } = await supabase
      .from('leads')
      .select('id, name, company, status')
      .eq('whatsapp', phoneNumber)
      .single();

    if (!lead) {
      console.log('No lead found for number:', phoneNumber);
      await supabase
        .from('whatsapp_replies')
        .insert({
          from_number: phoneNumber,
          message: Body.toString(),
          message_sid: MessageSid,
          sentiment: 'neutral',
          category: 'neutral',
          needs_response: true,
          received_at: new Date().toISOString(),
          status: 'unread',
        });
      
      return NextResponse.json({ status: 'ok' });
    }

    const analysis = analyzeWhatsAppReply(Body.toString());

    await supabase
      .from('whatsapp_replies')
      .insert({
        lead_id: lead.id,
        from_number: phoneNumber,
        message: Body.toString(),
        message_sid: MessageSid,
        sentiment: analysis.sentiment || 'neutral',
        category: analysis.category || 'neutral',
        needs_response: analysis.needsResponse || false,
        received_at: new Date().toISOString(),
        status: 'unread',
      });

    await updateLeadStatus(lead.id, analysis);

    console.log('WhatsApp reply stored for lead:', lead.id);
    return NextResponse.json({ status: 'ok' });

  } catch (error) {
    console.error('WhatsApp webhook error:', error);
    return NextResponse.json({ status: 'error' }, { status: 500 });
  }
}

function analyzeWhatsAppReply(message: string) {
  const lowerMessage = message.toLowerCase();
  
  const interested = ['interested', 'yes', 'sure', 'would like', 'tell me more', 'available', 'call', 'meeting', 'discuss', 'great'];
  const notInterested = ['not interested', 'no thanks', 'pass', 'not for us', 'no thank you'];
  const questions = ['how', 'what', 'when', 'where', 'why', 'who', '?'];
  
  let category = 'neutral';
  let sentiment = 'neutral';
  
  if (interested.some(word => lowerMessage.includes(word))) {
    category = 'interested';
    sentiment = 'positive';
  } else if (notInterested.some(word => lowerMessage.includes(word))) {
    category = 'not_interested';
    sentiment = 'negative';
  } else if (questions.some(word => lowerMessage.includes(word))) {
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
    case 'interested': status = 'warm'; break;
    case 'not_interested': status = 'cold'; break;
    case 'question': status = 'active'; break;
    default: status = 'active';
  }
  
  await supabase
    .from('leads')
    .update({ 
      status, 
      last_contact: new Date().toISOString() 
    })
    .eq('id', leadId);
}