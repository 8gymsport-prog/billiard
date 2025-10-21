import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Di masa depan, pemeriksaan yang lebih kompleks dapat ditambahkan di sini (misalnya, konektivitas database)
    return NextResponse.json({ status: 'ok', timestamp: new Date().toISOString() });
  } catch (error) {
    console.error('Health check failed:', error);
    return NextResponse.json({ status: 'error', message: 'Internal server error' }, { status: 500 });
  }
}
