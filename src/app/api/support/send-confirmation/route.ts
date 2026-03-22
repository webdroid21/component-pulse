import { NextResponse } from 'next/server';

import { sendTicketConfirmationEmail } from 'src/lib/email';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { contactEmail, contactName, subject } = body;

    if (!contactEmail || !contactName || !subject) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const success = await sendTicketConfirmationEmail(contactEmail, contactName, subject);

    if (success) {
      return NextResponse.json({ success: true, message: 'Ticket confirmation email sent.' });
    }
    
    return NextResponse.json(
      { error: 'Failed to send confirmation email. Check server logs.' },
      { status: 500 }
    );
  } catch (error: any) {
    console.error('Error in Support Confirmation API:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
