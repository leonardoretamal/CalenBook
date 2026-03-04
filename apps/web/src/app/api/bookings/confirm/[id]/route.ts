import { NextRequest, NextResponse } from 'next/server';
import { confirmBooking } from '@/app/(public)/booking-actions';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = await params;

  try {
    const result = await confirmBooking(id);

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    // Redirigir a la página de éxito
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/booking-confirmed`
    );
  } catch (error) {
    console.error('API Confirmation Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
