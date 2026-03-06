import type { NextRequest } from 'next/server';

import { NextResponse } from 'next/server';

import { sendTicketReplyEmail } from 'src/lib/email';

// ----------------------------------------------------------------------

export async function POST(request: NextRequest) {
    try {
        const { customerEmail, customerName, ticketNumber, ticketSubject, replyContent, ticketUrl } =
            await request.json() as {
                customerEmail: string;
                customerName: string;
                ticketNumber: string;
                ticketSubject: string;
                replyContent: string;
                ticketUrl: string;
            };

        if (!customerEmail || !customerName || !ticketNumber || !ticketSubject || !replyContent || !ticketUrl) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const success = await sendTicketReplyEmail(
            customerEmail,
            customerName,
            ticketNumber,
            ticketSubject,
            replyContent,
            ticketUrl
        );

        if (!success) {
            return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
        }

        return NextResponse.json({ status: 'done' });
    } catch (error) {
        console.error('Ticket reply email error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
