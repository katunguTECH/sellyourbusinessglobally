// app/api/outreach/process-queue/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import twilio from 'twilio';

export async function POST(request: Request) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const resend = new Resend(process.env.RESEND_API_KEY);
    const twilioClient = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );

    // Your approved WhatsApp template SID from the deployment
    const WHATSAPP_TEMPLATE_SID = process.env.WHATSAPP_TEMPLATE_SID;

    const { campaignId, limit = 5 } = await request.json();

    // Get pending queue items
    const { data: queueItems, error } = await supabase
      .from('outreach_queue')
      .select(`
        *,
        leads:lead_id (*)
      `)
      .eq('campaign_id', campaignId)
      .eq('status', 'pending')
      .order('next_run_at', { ascending: true })
      .limit(limit);

    if (error) throw error;
    if (!queueItems?.length) {
      return NextResponse.json({ message: 'No pending items' });
    }

    const results = [];

    for (const item of queueItems) {
      const lead = item.leads;
      const step = item.current_step;
      const sequence = [
        { type: 'email', template: 'initial_outreach' },
        { type: 'whatsapp', template: 'follow_up_whatsapp' },
        { type: 'email', template: 'value_proposition' },
        { type: 'whatsapp', template: 'final_nudge' },
      ];

      const currentStep = sequence[step] || sequence[0];

      try {
        // Send based on step type
        if (currentStep.type === 'email') {
          // Get personalized email template
          const emailContent = await generateEmail(lead, currentStep.template);

          await resend.emails.send({
            from: 'Acquisition Team <acquisitions@yourdomain.com>',
            to: lead.email,
            subject: emailContent.subject,
            html: emailContent.html,
          });

          await supabase.from('outreach_logs').insert({
            lead_id: lead.id,
            campaign_id: campaignId,
            type: 'email',
            status: 'sent',
            template: currentStep.template,
            sent_at: new Date().toISOString(),
          });

        } else if (currentStep.type === 'whatsapp') {
          // Send WhatsApp using approved template
          const message = await twilioClient.messages.create({
            from: `whatsapp:${process.env.TWILIO_WHATSAPP_FROM}`,
            to: `whatsapp:${lead.whatsapp}`,
            contentSid: WHATSAPP_TEMPLATE_SID,
            contentVariables: JSON.stringify({
              '1': lead.name,
              '2': lead.company,
              '3': lead.personalized_reason,
              '4': process.env.BOOKING_LINK,
            }),
          });

          await supabase.from('outreach_logs').insert({
            lead_id: lead.id,
            campaign_id: campaignId,
            type: 'whatsapp',
            status: 'sent',
            message_sid: message.sid,
            template: currentStep.template,
            sent_at: new Date().toISOString(),
          });
        }

        // Update queue item
        const nextStep = step + 1;
        const nextRun = new Date();
        // Add delay based on step
        const delays = [1, 2, 4, 7]; // days
        nextRun.setDate(nextRun.getDate() + delays[nextStep] || delays[0]);

        await supabase
          .from('outreach_queue')
          .update({
            current_step: nextStep,
            status: nextStep >= sequence.length ? 'completed' : 'pending',
            next_run_at: nextStep >= sequence.length ? null : nextRun.toISOString(),
          })
          .eq('id', item.id);

        results.push({ lead: lead.name, step: currentStep.type, status: 'sent' });

      } catch (sendError) {
        console.error(`Failed to send to ${lead.email}:`, sendError);

        await supabase.from('outreach_logs').insert({
          lead_id: lead.id,
          campaign_id: campaignId,
          type: currentStep.type,
          status: 'failed',
          error: String(sendError),
          sent_at: new Date().toISOString(),
        });

        // Retry later
        const retryDate = new Date();
        retryDate.setHours(retryDate.getHours() + 2);
        await supabase
          .from('outreach_queue')
          .update({ next_run_at: retryDate.toISOString() })
          .eq('id', item.id);

        results.push({ lead: lead.name, step: currentStep.type, status: 'failed' });
      }
    }

    return NextResponse.json({
      processed: results.length,
      results,
    });

  } catch (error) {
    console.error('Queue processing error:', error);
    return NextResponse.json(
      { error: 'Failed to process queue' },
      { status: 500 }
    );
  }
}

// Helper: Generate personalized email
async function generateEmail(lead: any, template: string) {
  // Pull from your templates or generate with OpenAI
  const templates = {
    initial_outreach: {
      subject: `Acquisition opportunity for ${lead.company}`,
      html: `
        <p>Hi ${lead.name},</p>
        <p>I came across ${lead.company} and noticed you're active in the ${lead.industry || 'media'} space.</p>
        <p>We're currently exploring strategic acquisitions and ${lead.company} seems like a great fit for our portfolio.</p>
        <p>${lead.personalized_reason || 'Would you be open to a brief conversation about potential synergies?'}</p>
        <p>Best regards,<br>Acquisition Team</p>
      `,
    },
    value_proposition: {
      subject: `Why ${lead.company} caught our attention`,
      html: `
        <p>Hi ${lead.name},</p>
        <p>Following up on my previous email. A few specific things that made ${lead.company} stand out:</p>
        <ul>
          <li>Your ${lead.strength || 'growth trajectory'} aligns with our investment thesis</li>
          <li>We see opportunities for ${lead.opportunity || 'significant expansion'}</li>
          <li>Our network could provide ${lead.network_benefit || 'valuable synergies'}</li>
        </ul>
        <p>Would you be available for a 15-minute call this week?</p>
        <p>Best,<br>Acquisition Team</p>
      `,
    },
  };

  return templates[template as keyof typeof templates] || templates.initial_outreach;
}