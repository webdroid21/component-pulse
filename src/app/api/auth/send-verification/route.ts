import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { adminAuth } from 'src/lib/firebase-admin';

const resend = new Resend(process.env.RESEND_API_KEY || 're_placeholder');

export async function POST(request: Request) {
  try {
    const { email, firstName } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    if (!adminAuth) {
      console.warn('Firebase Admin is not configured. Email will not be sent securely.');
      return NextResponse.json({ error: 'System configuration error' }, { status: 500 });
    }

    const actionCodeSettings = {
      // The Next.js custom action page created to handle the tokens
      url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:8083'}/auth/firebase/action`,
      handleCodeInApp: true,
    };

    // Generates the out-of-band code required for the validation action
    const link = await adminAuth.generateEmailVerificationLink(email, actionCodeSettings);

    // Send the beautifully designed custom email template via Resend
    const data = await resend.emails.send({
      from: 'Component Pulse <onboarding@componentpulseug.com>',
      to: [email],
      subject: 'Verify your email address - Component Pulse',
      html: `
        <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 40px auto; padding: 32px; border: 1px solid #eaeaea; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
          <div style="text-align: center; margin-bottom: 24px;">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
          <h1 style="color: #111827; text-align: center; font-size: 24px; font-weight: 700; margin-bottom: 16px;">Verify your email</h1>
          <p style="color: #4b5563; font-size: 16px; line-height: 24px; text-align: center;">
            Hello ${firstName || 'User'},
          </p>
          <p style="color: #4b5563; font-size: 16px; line-height: 24px; text-align: center; margin-bottom: 32px;">
            Thank you for registering with Component Pulse! Please click the button below to verify your email address and activate your account.
          </p>
          <div style="text-align: center; margin: 32px 0;">
            <a href="${link}" style="background-color: #2563eb; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; display: inline-block; transition: background-color 0.2s;">
              Verify Email Address
            </a>
          </div>
          <hr style="border: none; border-top: 1px solid #eaeaea; margin: 32px 0;" />
          <p style="color: #9ca3af; font-size: 14px; text-align: center; line-height: 20px;">
            If you're having trouble clicking the button, copy and paste this link into your browser:<br/>
            <a href="${link}" style="color: #2563eb; word-break: break-all; text-decoration: underline; margin-top: 8px; display: inline-block;">${link}</a>
          </p>
          <p style="color: #9ca3af; font-size: 14px; text-align: center; margin-top: 24px;">
            If you didn't request this email, you can safely ignore it.
          </p>
        </div>
      `,
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error generating verification link:', error);
    return NextResponse.json({ error: 'Failed to generate verification link' }, { status: 500 });
  }
}
