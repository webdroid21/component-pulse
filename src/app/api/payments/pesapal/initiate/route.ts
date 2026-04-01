import type { NextRequest } from 'next/server';

import { NextResponse } from 'next/server';

import { getPesapalToken, submitPesapalOrder, generateMerchantRef } from 'src/lib/pesapal';

// ----------------------------------------------------------------------

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, description, customer, orderId } = body;

    if (!amount || !customer?.email) {
      return NextResponse.json({ error: 'Missing required payment fields' }, { status: 400 });
    }

    const ipnId = process.env.PESAPAL_IPN_ID;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    if (!ipnId) {
      return NextResponse.json(
        { error: 'PESAPAL_IPN_ID not configured. Register your IPN URL first.' },
        { status: 500 }
      );
    }

    const merchantRef = orderId || generateMerchantRef('CP');

    // Get fresh token
    const token = await getPesapalToken();

    // Submit the order to Pesapal
    const pesapalResponse = await submitPesapalOrder(token, {
      id: merchantRef,
      currency: 'UGX',
      amount: Math.round(amount),
      description: description || 'ComponentPulse Order',
      callback_url: `${appUrl}/checkout/callback`,
      cancellation_url: `${appUrl}/checkout`,
      notification_id: ipnId,
      billing_address: {
        email_address: customer.email || '',
        phone_number: customer.phone || '',
        first_name: customer.firstName || '',
        last_name: customer.lastName || '',
        country_code: 'UG',
      },
    });

    return NextResponse.json({
      redirect_url: pesapalResponse.redirect_url,
      order_tracking_id: pesapalResponse.order_tracking_id,
      merchant_reference: merchantRef,
    });
  } catch (error: any) {
    console.error('Pesapal initiate error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to initiate payment' },
      { status: 500 }
    );
  }
}
