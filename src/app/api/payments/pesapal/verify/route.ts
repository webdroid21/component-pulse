import type { NextRequest } from 'next/server';

import { NextResponse } from 'next/server';

import { getPesapalToken, getPesapalTransactionStatus } from 'src/lib/pesapal';

// ----------------------------------------------------------------------

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderTrackingId = searchParams.get('orderTrackingId');

    if (!orderTrackingId) {
      return NextResponse.json({ error: 'Missing orderTrackingId' }, { status: 400 });
    }

    const token = await getPesapalToken();
    const status = await getPesapalTransactionStatus(token, orderTrackingId);

    return NextResponse.json({
      payment_status_description: status.payment_status_description,
      confirmation_code: status.confirmation_code,
      payment_method: status.payment_method,
      amount: status.amount,
      merchant_reference: status.merchant_reference,
      order_tracking_id: status.order_tracking_id,
    });
  } catch (error: any) {
    console.error('Pesapal verify error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to verify payment' },
      { status: 500 }
    );
  }
}
