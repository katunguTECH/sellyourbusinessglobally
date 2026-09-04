import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const filter = searchParams.get('filter') || 'all';
    const limit = parseInt(searchParams.get('limit') || '50');
    
    let query = supabase
      .from('unified_replies')
      .select(`
        *,
        lead:lead_id (
          id,
          name,
          company,
          email,
          whatsapp,
          status
        )
      `)
      .order('received_at', { ascending: false })
      .limit(limit);
    
    if (filter === 'unread') {
      query = query.eq('status', 'unread');
    } else if (filter !== 'all') {
      query = query.eq('category', filter);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    return NextResponse.json(data || []);
    
  } catch (error) {
    console.error('Failed to fetch replies:', error);
    return NextResponse.json(
      { error: 'Failed to fetch replies' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { leadId, message, channel } = await request.json();
    
    if (!leadId || !message) {
      return NextResponse.json(
        { error: 'Lead ID and message required' },
        { status: 400 }
      );
    }
    
    // Store the reply
    if (channel === 'email') {
      const { error } = await supabase
        .from('email_replies')
        .insert({
          lead_id: leadId,
          body: message,
          from_email: 'system@yourdomain.com',
          subject: 'Manual Reply',
          status: 'replied',
          replied_at: new Date().toISOString(),
        });
      
      if (error) throw error;
    } else {
      const { error } = await supabase
        .from('whatsapp_replies')
        .insert({
          lead_id: leadId,
          message: message,
          from_number: 'system',
          status: 'replied',
          replied_at: new Date().toISOString(),
        });
      
      if (error) throw error;
    }
    
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('Failed to store reply:', error);
    return NextResponse.json(
      { error: 'Failed to store reply' },
      { status: 500 }
    );
  }
}