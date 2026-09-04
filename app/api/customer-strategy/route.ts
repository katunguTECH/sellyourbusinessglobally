// app/api/customer-strategy/route.ts
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

    const prompt = `
      Analyze this consumer product/app and create a customer acquisition strategy.
      ${url ? `Product URL: ${url}` : ''}
      ${businessDescription ? `Description: ${businessDescription}` : ''}

      Return a JSON object with:
      1. A one-paragraph summary of the target audience
      2. 5-8 acquisition channels (platform/community name, why it fits, a specific content or engagement angle)
      3. 5 SEO/content keyword ideas relevant to organic discovery
      4. 3 app store / discovery optimization suggestions if relevant

      Format as valid JSON:
      {
        "audienceSummary": "string",
        "channels": [
          { "platform": "string", "why": "string", "angle": "string" }
        ],
        "keywords": ["string"],
        "discoveryTips": ["string"]
      }
    `;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: 'You are a consumer growth marketing strategist. Return only valid JSON.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' }
    });

    const result = JSON.parse(completion.choices[0].message.content || '{}');

    return NextResponse.json(result);

  } catch (error) {
    console.error('Customer strategy error:', error);
    return NextResponse.json(
      { error: 'Failed to generate customer strategy' },
      { status: 500 }
    );
  }
}