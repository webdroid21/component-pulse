import type { NextRequest} from 'next/server';

import { NextResponse } from 'next/server';

import { type OrderEmailData, sendOrderConfirmationEmail } from 'src/lib/email';

// ----------------------------------------------------------------------

export async function POST(request: NextRequest) {
  try {
    const data: OrderEmailData = await request.json();

    if (!data.customerEmail || !data.orderNumber) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const success = await sendOrderConfirmationEmail(data);

    if (success) {
      return NextResponse.json({ status: 'sent' });
    }

    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  } catch (error) {
    console.error('Send confirmation email error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
