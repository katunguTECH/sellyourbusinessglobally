// app/api/icp-generator/route.ts
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(request: Request) {
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

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

    // Auto-run real lead searches for each persona (hits Hunter for domains,
    // Apollo for person/industry queries — Apollo currently returns a
    // friendly "unavailable" message until the plan is upgraded)
    const leads = await Promise.all(
      (result.buyerPersonas || []).map(async (persona: any) => {
        const query = persona.apolloQuery || `${persona.title} ${persona.industry}`;
        const params = new URLSearchParams({ q: query, limit: '10' });

        try {
          const searchResponse = await fetch(
            `${process.env.NEXT_PUBLIC_APP_URL}/api/leads/apollo-search?${params.toString()}`,
            { method: 'GET' }
          );
          const searchData = await searchResponse.json();
          return {
            persona,
            leads: searchData.leads || [],
            source: searchData.source || 'unknown',
            message: searchData.message || null,
          };
        } catch (searchError) {
          console.error(`Lead search failed for persona "${query}":`, searchError);
          return {
            persona,
            leads: [],
            source: 'error',
            message: 'Lead search failed for this persona.',
          };
        }
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