// app/api/outreach/sequence/route.ts
import { NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase-server';

export async function POST(request: Request) {
  try {
    const supabase = getSupabaseServerClient();

    const { leadIds, campaignName, sequenceSteps } = await request.json();

    if (!leadIds?.length) {
      return NextResponse.json({ error: 'Lead IDs required' }, { status: 400 });
    }

    // Get leads with their contact info
    const { data: leads, error } = await supabase
      .from('leads')
      .select('*')
      .in('id', leadIds);

    if (error) throw error;

    // Create campaign record
    const { data: campaign, error: campaignError } = await supabase
      .from('campaigns')
      .insert({
        name: campaignName || `Acquisition Campaign ${new Date().toLocaleDateString()}`,
        total_leads: leads.length,
        status: 'active',
        steps: sequenceSteps || [
          { day: 1, type: 'email', template: 'initial_outreach' },
          { day: 2, type: 'whatsapp', template: 'follow_up_whatsapp' },
          { day: 4, type: 'email', template: 'value_proposition' },
          { day: 7, type: 'whatsapp', template: 'final_nudge' },
        ],
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (campaignError) throw campaignError;

    // Queue each lead for the sequence
    const queueItems = leads.map((lead) => ({
      campaign_id: campaign.id,
      lead_id: lead.id,
      current_step: 0,
      status: 'pending',
      next_run_at: new Date().toISOString(),
      contact_data: {
        email: lead.email,
        whatsapp: lead.whatsapp,
        name: lead.name,
        company: lead.company,
      },
    }));

    const { error: queueError } = await supabase
      .from('outreach_queue')
      .insert(queueItems);

    if (queueError) throw queueError;

    // Trigger the first batch
    await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/outreach/process-queue`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ campaignId: campaign.id, limit: 10 }),
    });

    return NextResponse.json({
      success: true,
      campaignId: campaign.id,
      leadsQueued: leads.length,
      message: `Campaign started for ${leads.length} leads`,
    });

  } catch (error) {
    console.error('Outreach sequence error:', error);
    return NextResponse.json(
      { error: 'Failed to start outreach sequence' },
      { status: 500 }
    );
  }
}