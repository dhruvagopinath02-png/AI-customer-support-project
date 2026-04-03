import { NextRequest, NextResponse } from 'next/server';
import { PDFParse } from 'pdf-parse';

// Force Node.js runtime (not Edge) — required for Buffer and pdf-parse on Vercel
export const runtime = 'nodejs';

// Allow up to 4MB uploads on Vercel serverless
export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');

    // Validate that we received a File object (not a string or null)
    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    let text = '';

    if (file.type === 'application/pdf') {
      const parser = new PDFParse({ data: uint8Array });
      const result = await parser.getText();
      text = result.text;
      await parser.destroy();
    } else if (file.type === 'text/plain') {
      text = new TextDecoder('utf-8').decode(uint8Array);
    } else {
      return NextResponse.json({ error: 'Unsupported file type. Please upload a PDF or TXT file.' }, { status: 400 });
    }

    // Basic cleaning of text
    text = text.replace(/\s+/g, ' ').trim();

    if (!text) {
      return NextResponse.json({ error: 'Could not extract any text from the file.' }, { status: 400 });
    }

    return NextResponse.json({ text });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    console.error('Error in upload API:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
