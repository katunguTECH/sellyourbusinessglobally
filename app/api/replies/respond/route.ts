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
    const { replyId, message, channel } = await request.json();
    
    if (!replyId || !message) {
      return NextResponse.json(
        { error: 'Reply ID and message required' },
        { status: 400 }
      );
    }
    
    const table = channel === 'email' ? 'email_replies' : 'whatsapp_replies';
    const { data: reply, error } = await supabase
      .from(table)
      .select('*, lead:lead_id(*)')
      .eq('id', replyId)
      .single();
    
    if (error || !reply) {
      return NextResponse.json(
        { error: 'Reply not found' },
        { status: 404 }
      );
    }
    
    const { error: updateError } = await supabase
      .from(table)
      .update({
        status: 'replied',
        reply_message: message,
        replied_at: new Date().toISOString(),
      })
      .eq('id', replyId);
    
    if (updateError) throw updateError;
    
    console.log(`Reply sent to ${reply.lead.name} (${reply.lead.email}):`, message);
    
    return NextResponse.json({ 
      success: true,
      message: 'Reply marked as sent'
    });
    
  } catch (error) {
    console.error('Failed to send reply:', error);
    return NextResponse.json(
      { error: 'Failed to send reply' },
      { status: 500 }
    );
  }
}