// app/api/icp-generator/route.ts
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { url, businessDescription } = await request.json();

    if (!url && !businessDescription) {
      return NextResponse.json(
        { error: 'Either URL or business description is required' },
        { status: 400 }
      );
    }

    // First, analyze the business
    const analysisPrompt = `
      Analyze this business and identify who would want to acquire it.
      ${url ? `Business URL: ${url}` : ''}
      ${businessDescription ? `Description: ${businessDescription}` : ''}

      Return a JSON object with:
      1. Business summary (what they do, key assets)
      2. 5-10 specific buyer personas (title, industry, company type, why they'd buy)
      3. Suggested search queries for Apollo

      Format as valid JSON:
      {
        "businessSummary": "string",
        "buyerPersonas": [
          {
            "title": "string",
            "industry": "string",
            "companyType": "string",
            "motivation": "string",
            "apolloQuery": "string"
          }
        ]
      }
    `;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        { role: 'system', content: 'You are a business acquisition analyst. Return only valid JSON.' },
        { role: 'user', content: analysisPrompt }
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' }
    });

    const result = JSON.parse(completion.choices[0].message.content || '{}');
    
    // Auto-run Apollo searches for each persona
    const leads = await Promise.all(
      result.buyerPersonas.map(async (persona: any) => {
        const searchResponse = await fetch(
          `${process.env.NEXT_PUBLIC_APP_URL}/api/leads/search`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              query: persona.apolloQuery || `${persona.title} ${persona.industry}`,
              persona: persona,
            }),
          }
        );
        const searchData = await searchResponse.json();
        return {
          persona,
          leads: searchData.leads || [],
        };
      })
    );

    return NextResponse.json({
      businessSummary: result.businessSummary,
      buyerPersonas: result.buyerPersonas,
      enrichedLeads: leads,
    });
  } catch (error) {
    console.error('ICP Generator error:', error);
    return NextResponse.json(
      { error: 'Failed to generate ICP' },
      { status: 500 }
    );
  }
}