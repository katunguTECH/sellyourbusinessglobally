import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '100');
    
    let query = supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (status) {
      query = query.eq('status', status);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    return NextResponse.json(data || []);
    
  } catch (error) {
    console.error('Failed to fetch leads:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leads' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, whatsapp, company, industry, title, source } = body;
    
    if (!email && !whatsapp) {
      return NextResponse.json(
        { error: 'Email or WhatsApp required' },
        { status: 400 }
      );
    }
    
    const { data, error } = await supabase
      .from('leads')
      .insert({
        name,
        email,
        whatsapp,
        company,
        industry,
        title,
        source,
        status: 'new',
        stage: 'discovery',
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('Failed to create lead:', error);
    return NextResponse.json(
      { error: 'Failed to create lead' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, status, stage, notes } = body;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Lead ID required' },
        { status: 400 }
      );
    }
    
    const updateData: any = {};
    if (status) updateData.status = status;
    if (stage) updateData.stage = stage;
    if (notes) updateData.notes = notes;
    updateData.updated_at = new Date().toISOString();
    
    const { data, error } = await supabase
      .from('leads')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('Failed to update lead:', error);
    return NextResponse.json(
      { error: 'Failed to update lead' },
      { status: 500 }
    );
  }
}