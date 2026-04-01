// ----------------------------------------------------------------------
// Pesapal API 3.0 Integration — SERVER SIDE ONLY
// Never import this file in client components ('use client').
// All credentials are read from server-only environment variables.
// ----------------------------------------------------------------------

const PESAPAL_BASE_URL = process.env.PESAPAL_BASE_URL || 'https://cybqa.pesapal.com/pesapalv3';

// ----------------------------------------------------------------------
// Types
// ----------------------------------------------------------------------

export type PesapalTokenResponse = {
  token: string;
  expiryDate: string;
  error: null | { type: string; code: string; message: string };
  status: string;
  message: string;
};

export type PesapalBillingAddress = {
  email_address?: string;
  phone_number?: string;
  country_code?: string;
  first_name?: string;
  middle_name?: string;
  last_name?: string;
  line_1?: string;
  line_2?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  zip_code?: string;
};

export type PesapalOrderPayload = {
  id: string;
  currency: string;
  amount: number;
  description: string;
  callback_url: string;
  cancellation_url?: string;
  notification_id: string;
  billing_address: PesapalBillingAddress;
};

export type PesapalOrderResponse = {
  order_tracking_id: string;
  merchant_reference: string;
  redirect_url: string;
  error: null | { type: string; code: string; message: string };
  status: string;
};

export type PesapalTransactionStatus = {
  payment_method: string;
  amount: number;
  created_date: string;
  confirmation_code: string;
  payment_status_description: string;
  description: string;
  message: string;
  merchant_reference: string;
  order_tracking_id: string;
  status: string;
  error: null | { type: string; code: string; message: string };
};

// ----------------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------------

/**
 * Generates a unique merchant reference string (max 50 chars).
 * Replaces the old Flutterwave `generateTxRef` utility.
 */
export function generateMerchantRef(prefix: string = 'CP'): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

// ----------------------------------------------------------------------
// API Functions
// ----------------------------------------------------------------------

/**
 * Authenticates with Pesapal and returns a fresh Bearer token.
 * Tokens are valid for ~5 minutes; fetch fresh for each server request.
 */
export async function getPesapalToken(): Promise<string> {
  const consumer_key = process.env.PESAPAL_CONSUMER_KEY;
  const consumer_secret = process.env.PESAPAL_CONSUMER_SECRET;

  if (!consumer_key || !consumer_secret) {
    throw new Error(
      'Pesapal credentials not configured. Set PESAPAL_CONSUMER_KEY and PESAPAL_CONSUMER_SECRET.'
    );
  }

  const response = await fetch(`${PESAPAL_BASE_URL}/api/Auth/RequestToken`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ consumer_key, consumer_secret }),
  });

  if (!response.ok) {
    throw new Error(`Pesapal auth failed: ${response.status} ${response.statusText}`);
  }

  const data: PesapalTokenResponse = await response.json();

  if (data.error || data.status !== '200') {
    throw new Error(`Pesapal auth error: ${data.error?.message || data.message}`);
  }

  return data.token;
}

/**
 * Submits a payment order to Pesapal.
 * Returns the redirect_url to send the customer to, plus order_tracking_id.
 */
export async function submitPesapalOrder(
  token: string,
  payload: PesapalOrderPayload
): Promise<PesapalOrderResponse> {
  const response = await fetch(`${PESAPAL_BASE_URL}/api/Transactions/SubmitOrderRequest`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Pesapal order submission failed: ${response.status} ${response.statusText}`);
  }

  const data: PesapalOrderResponse = await response.json();

  if (data.error) {
    throw new Error(`Pesapal order error: ${data.error.message}`);
  }

  return data;
}

/**
 * Fetches the current status of a Pesapal transaction.
 * Always call this server-side — never trust callback/IPN params alone.
 */
export async function getPesapalTransactionStatus(
  token: string,
  orderTrackingId: string
): Promise<PesapalTransactionStatus> {
  const response = await fetch(
    `${PESAPAL_BASE_URL}/api/Transactions/GetTransactionStatus?orderTrackingId=${encodeURIComponent(orderTrackingId)}`,
    {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Pesapal status check failed: ${response.status} ${response.statusText}`);
  }

  const data: PesapalTransactionStatus = await response.json();

  if (data.error) {
    throw new Error(`Pesapal status error: ${data.error.message}`);
  }

  return data;
}
