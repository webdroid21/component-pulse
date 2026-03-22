import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// Initialize Resend with your API key
const resend = new Resend(process.env.RESEND_API_KEY || 're_placeholder');

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, firstName } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const data = await resend.emails.send({
      from: 'Welcome <onboarding@resend.dev>', // Update with your verified domain
      to: [email],
      subject: 'Welcome to Component Pulse!',
      html: `
        <div>
          <h1>Welcome, ${firstName || 'User'}!</h1>
          <p>We are thrilled to have you on board. Component Pulse gives you the power to manage your resources seamlessly.</p>
          <p>If you have any questions, feel free to reply to this email.</p>
          <br />
          <p>Best regards,</p>
          <p>The Component Pulse Team</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return NextResponse.json(
      { error: 'Failed to send welcome email' },
      { status: 500 }
    );
  }
}
