import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization')
    const secret = process.env.SANITY_WEBHOOK_SECRET

    // Check optional simple webhook secret defined in env
    if (secret && authHeader !== `Bearer ${secret}`) {
      return NextResponse.json({ message: 'Invalid signature' }, { status: 401 })
    }

    const payload = await req.json()

    // Revalider tout le site (layout)
    revalidatePath('/', 'layout')

    return NextResponse.json({ 
      revalidated: true, 
      type: payload._type, 
      now: Date.now() 
    })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
