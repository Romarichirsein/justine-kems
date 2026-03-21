import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    return NextResponse.json({ message: 'Revalidated', body }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: 'Error' }, { status: 500 });
  }
}
