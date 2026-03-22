import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { adminAuth } from 'src/lib/firebase-admin';

const resend = new Resend(process.env.RESEND_API_KEY || 're_placeholder');

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    if (!adminAuth) {
      console.warn('Firebase Admin is not configured. Email will not be sent securely.');
      return NextResponse.json({ error: 'System configuration error' }, { status: 500 });
    }

    const actionCodeSettings = {
      // The Next.js custom action page designed for password reset UI
      url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:8083'}/auth/firebase/action`,
      handleCodeInApp: true,
    };

    // Generates the out-of-band code required for the password reset action
    const link = await adminAuth.generatePasswordResetLink(email, actionCodeSettings);

    // Send the beautifully designed custom email template via Resend
    const data = await resend.emails.send({
      from: 'Component Pulse <security@resend.dev>', // Update with a verified domain
      to: [email],
      subject: 'Reset your password - Component Pulse',
      html: `
        <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 40px auto; padding: 32px; border: 1px solid #eaeaea; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
          <div style="text-align: center; margin-bottom: 24px;">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
          </div>
          <h1 style="color: #111827; text-align: center; font-size: 24px; font-weight: 700; margin-bottom: 16px;">Reset your password</h1>
          <p style="color: #4b5563; font-size: 16px; line-height: 24px; text-align: center; margin-bottom: 32px;">
            We received a request to reset the password for your Component Pulse account. Click the button below to securely set a new password.
          </p>
          <div style="text-align: center; margin: 32px 0;">
            <a href="${link}" style="background-color: #dc2626; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; display: inline-block; transition: background-color 0.2s;">
              Reset Password
            </a>
          </div>
          <hr style="border: none; border-top: 1px solid #eaeaea; margin: 32px 0;" />
          <p style="color: #9ca3af; font-size: 14px; text-align: center; line-height: 20px;">
            If you're having trouble clicking the button, copy and paste this link into your browser:<br/>
            <a href="${link}" style="color: #dc2626; word-break: break-all; text-decoration: underline; margin-top: 8px; display: inline-block;">${link}</a>
          </p>
          <p style="color: #9ca3af; font-size: 14px; text-align: center; margin-top: 24px;">
            If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.
          </p>
        </div>
      `,
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error generating reset link:', error);
    return NextResponse.json({ error: 'Failed to generate password reset link' }, { status: 500 });
  }
}
