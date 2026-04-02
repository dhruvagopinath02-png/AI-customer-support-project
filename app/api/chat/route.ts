import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: NextRequest) {
  try {
    const { prompt, context } = await req.json();

    if (!prompt || !context) {
      return NextResponse.json({ error: 'Missing prompt or context' }, { status: 400 });
    }

    const systemPrompt = `
      You are a professional AI Customer Support Agent.
      Use ONLY the provided context from the uploaded document to answer the user's question.
      If the answer is not in the context, politely state that you can only answer questions based on the provided material.
      Be helpful, concise, and professional.

      Context:
      ---
      ${context}
      ---
    `;

    // Updated to a valid, active API model
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash',
      systemInstruction: systemPrompt
    });

    const result = await model.generateContent(`User Question: ${prompt}`);

    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ text });
  } catch (error: any) {
    console.error('Error in chat API:', error);
    
    const errorMessage = error?.message || '';
    
    // Catch rate-limit / Quota errors
    if (errorMessage.includes('429 Too Many Requests') || errorMessage.includes('quota') || errorMessage.includes('Quota')) {
      return NextResponse.json({ 
        error: "We are receiving too many requests right now and hit the AI's quota limit. Please wait a minute and try your question again!" 
      }, { status: 429 });
    }

    return NextResponse.json({ error: errorMessage || 'Internal server error' }, { status: 500 });
  }
}