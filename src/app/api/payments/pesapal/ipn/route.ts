import type { NextRequest } from 'next/server';

import { NextResponse } from 'next/server';
import {
  doc,
  query,
  where,
  getDocs,
  collection,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';

import { FIRESTORE } from 'src/lib/firebase';
import { getPesapalToken, getPesapalTransactionStatus } from 'src/lib/pesapal';

// ----------------------------------------------------------------------
// Pesapal IPN Handler
// Pesapal calls this via GET with: OrderTrackingId, OrderMerchantReference, OrderNotificationType
// We must verify status server-side, then update our Firestore order.
// ----------------------------------------------------------------------

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderTrackingId = searchParams.get('OrderTrackingId');
    const merchantReference = searchParams.get('OrderMerchantReference');
    const notificationType = searchParams.get('OrderNotificationType');

    console.log('Pesapal IPN received:', { orderTrackingId, merchantReference, notificationType });

    if (!orderTrackingId || !merchantReference) {
      return NextResponse.json({ error: 'Missing IPN parameters' }, { status: 400 });
    }

    // Verify payment status server-side — never trust IPN params alone
    const token = await getPesapalToken();
    const statusData = await getPesapalTransactionStatus(token, orderTrackingId);

    console.log(
      'Pesapal transaction status:',
      statusData.payment_status_description,
      merchantReference
    );

    // Find the matching order in Firestore by merchant_reference
    const ordersQ = query(
      collection(FIRESTORE, 'orders'),
      where('paymentReference', '==', merchantReference)
    );
    const ordersSnap = await getDocs(ordersQ);

    if (ordersSnap.empty) {
      console.error('Order not found for merchant reference:', merchantReference);
      // Still return 200 to acknowledge IPN receipt
      return NextResponse.json({ status: 'acknowledged' });
    }

    const orderDoc = ordersSnap.docs[0];
    const order = orderDoc.data();
    const isPaid = statusData.payment_status_description === 'Completed';
    const isFailed = statusData.payment_status_description === 'Failed';

    const updateData: Record<string, any> = {
      pesapalTrackingId: orderTrackingId,
      updatedAt: serverTimestamp(),
    };

    if (isPaid && order.paymentStatus !== 'paid') {
      updateData.paymentStatus = 'paid';
      if (order.status === 'pending') {
        updateData.status = 'confirmed';
        updateData.statusHistory = [
          ...(order.statusHistory || []),
          {
            status: 'confirmed',
            timestamp: serverTimestamp(),
            note: `Payment confirmed via Pesapal (${statusData.payment_method || 'online'})`,
          },
        ];
      }
    } else if (isFailed) {
      updateData.paymentStatus = 'failed';
    }

    await updateDoc(doc(FIRESTORE, 'orders', orderDoc.id), updateData);
    console.log('Order updated via IPN:', orderDoc.id, statusData.payment_status_description);

    return NextResponse.json({ status: 'acknowledged' });
  } catch (error: any) {
    console.error('Pesapal IPN error:', error);
    // Always return 200 to Pesapal so it doesn't retry indefinitely
    return NextResponse.json({ status: 'error', message: error.message });
  }
}
