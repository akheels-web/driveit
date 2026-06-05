import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const { carId } = await request.json()
    if (!carId) return NextResponse.json({ error: 'Car ID is required' }, { status: 400 })

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // Check if it exists
    const { data: existing } = await supabase
      .from('wishlists')
      .select('id')
      .eq('user_id', user.id)
      .eq('car_id', carId)
      .single()

    if (existing) {
      // Remove from wishlist
      const { error } = await supabase
        .from('wishlists')
        .delete()
        .eq('id', existing.id)
      
      if (error) throw error
      return NextResponse.json({ status: 'removed' })
    } else {
      // Add to wishlist
      const { error } = await supabase
        .from('wishlists')
        .insert({ user_id: user.id, car_id: carId })

      if (error) throw error
      return NextResponse.json({ status: 'added' })
    }
  } catch (error: any) {
    console.error('Wishlist error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ wishlists: [] })

    const { data, error } = await supabase
      .from('wishlists')
      .select('car_id')
      .eq('user_id', user.id)

    if (error) throw error
    return NextResponse.json({ wishlists: data.map(d => d.car_id) })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
