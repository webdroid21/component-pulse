import type { NextRequest} from 'next/server';

import { NextResponse } from 'next/server';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';

import { FIRESTORE } from 'src/lib/firebase';

// ----------------------------------------------------------------------

const FLUTTERWAVE_SECRET_KEY = process.env.FLUTTERWAVE_SECRET_KEY;

type FlutterwaveWebhookPayload = {
  event: string;
  data: {
    id: number;
    tx_ref: string;
    flw_ref: string;
    amount: number;
    currency: string;
    charged_amount: number;
    status: 'successful' | 'failed' | 'pending';
    payment_type: string;
    customer: {
      email: string;
      name: string;
      phone_number: string;
    };
    meta?: {
      orderId?: string;
    };
  };
};

export async function POST(request: NextRequest) {
  try {
    // Verify webhook signature
    const secretHash = request.headers.get('verif-hash');
    if (!secretHash || secretHash !== FLUTTERWAVE_SECRET_KEY) {
      console.error('Invalid Flutterwave webhook signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const payload: FlutterwaveWebhookPayload = await request.json();
    console.log('Flutterwave webhook received:', payload.event, payload.data.tx_ref);

    if (payload.event === 'charge.completed') {
      const { data } = payload;
      const orderId = data.meta?.orderId || data.tx_ref.split('-').slice(1).join('-');

      // Find order by tx_ref or orderId
      const orderRef = doc(FIRESTORE, 'orders', orderId);
      const orderSnap = await getDoc(orderRef);

      if (!orderSnap.exists()) {
        console.error('Order not found for tx_ref:', data.tx_ref);
        return NextResponse.json({ error: 'Order not found' }, { status: 404 });
      }

      const order = orderSnap.data();

      // Update payment status based on Flutterwave status
      const paymentStatus = data.status === 'successful' ? 'paid' : 'failed';
      const orderStatus = data.status === 'successful' ? 'confirmed' : order.status;

      const updateData: Record<string, any> = {
        paymentStatus,
        paymentReference: data.flw_ref,
        updatedAt: serverTimestamp(),
      };

      if (data.status === 'successful' && order.status === 'pending') {
        updateData.status = orderStatus;
        updateData.statusHistory = [
          ...(order.statusHistory || []),
          {
            status: 'confirmed',
            timestamp: serverTimestamp(),
            note: `Payment confirmed via ${data.payment_type}`,
          },
        ];
      }

      await updateDoc(orderRef, updateData);

      // TODO: Send email notification
      // await sendOrderConfirmationEmail(order, data);

      console.log('Order updated successfully:', orderId, paymentStatus);
    }

    return NextResponse.json({ status: 'success' });
  } catch (error) {
    console.error('Flutterwave webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
