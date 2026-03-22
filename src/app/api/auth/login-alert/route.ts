import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 're_placeholder');

export async function POST(request: Request) {
  try {
    const { email, firstName, time, device } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Send the beautifully designed custom email template via Resend
    const data = await resend.emails.send({
      from: 'Component Pulse Security <security@resend.dev>', // Update with a verified domain
      to: [email],
      subject: 'New login to your Component Pulse account',
      html: `
        <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 40px auto; padding: 32px; border: 1px solid #eaeaea; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
          <div style="text-align: center; margin-bottom: 24px;">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#eab308" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </svg>
          </div>
          <h1 style="color: #111827; text-align: center; font-size: 24px; font-weight: 700; margin-bottom: 16px;">New Login Detected</h1>
          <p style="color: #4b5563; font-size: 16px; line-height: 24px; text-align: center; margin-bottom: 24px;">
            Hello ${firstName || 'User'},
          </p>
          <p style="color: #4b5563; font-size: 16px; line-height: 24px; text-align: center; margin-bottom: 32px;">
            We noticed a new login to your Component Pulse account. If this was you, you don't need to do anything. If not, we recommend changing your password immediately.
          </p>
          <div style="background-color: #f9fafb; padding: 24px; border-radius: 8px; margin-bottom: 32px;">
            <p style="color: #374151; font-size: 14px; margin: 0 0 8px 0;"><strong>Time:</strong> ${time || new Date().toLocaleString()}</p>
            <p style="color: #374151; font-size: 14px; margin: 0;"><strong>Device/Browser:</strong> ${device || 'Unknown Device'}</p>
          </div>
          <hr style="border: none; border-top: 1px solid #eaeaea; margin: 32px 0;" />
          <p style="color: #9ca3af; font-size: 14px; text-align: center; margin-top: 24px;">
            If you have any questions or concerns, please contact our support team.
          </p>
        </div>
      `,
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error sending login alert:', error);
    return NextResponse.json({ error: 'Failed to send login alert' }, { status: 500 });
  }
}
