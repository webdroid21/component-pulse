import type { NextRequest} from 'next/server';

import { NextResponse } from 'next/server';

import { sendOrderStatusUpdateEmail } from 'src/lib/email';

// ----------------------------------------------------------------------

export async function POST(request: NextRequest) {
  try {
    const { customerEmail, customerName, orderNumber, newStatus, statusNote } = await request.json();

    if (!customerEmail || !orderNumber || !newStatus) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const success = await sendOrderStatusUpdateEmail(
      customerEmail,
      customerName,
      orderNumber,
      newStatus,
      statusNote
    );

    if (success) {
      return NextResponse.json({ status: 'sent' });
    }

    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  } catch (error) {
    console.error('Send status update email error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
