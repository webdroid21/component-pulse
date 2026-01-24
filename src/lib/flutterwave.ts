'use client';

// ----------------------------------------------------------------------
// Flutterwave Payment Integration
// Uses inline script method for React 19 compatibility
// ----------------------------------------------------------------------

export type FlutterwaveConfig = {
  public_key: string;
  tx_ref: string;
  amount: number;
  currency: string;
  payment_options?: string;
  customer: {
    email: string;
    phone_number: string;
    name: string;
  };
  customizations?: {
    title?: string;
    description?: string;
    logo?: string;
  };
  meta?: Record<string, any>;
};

export type FlutterwaveResponse = {
  status: 'successful' | 'cancelled' | 'failed';
  transaction_id?: number;
  tx_ref: string;
  flw_ref?: string;
  amount?: number;
  currency?: string;
  charged_amount?: number;
};

declare global {
  interface Window {
    FlutterwaveCheckout: (config: FlutterwaveConfig & {
      callback: (response: FlutterwaveResponse) => void;
      onclose: () => void;
    }) => void;
  }
}

let scriptLoaded = false;
let scriptLoading = false;
const loadCallbacks: (() => void)[] = [];

export function loadFlutterwaveScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (scriptLoaded && typeof window.FlutterwaveCheckout === 'function') {
      resolve();
      return;
    }

    if (scriptLoading) {
      loadCallbacks.push(() => resolve());
      return;
    }

    scriptLoading = true;

    const script = document.createElement('script');
    script.src = 'https://checkout.flutterwave.com/v3.js';
    script.async = true;

    script.onload = () => {
      scriptLoaded = true;
      scriptLoading = false;
      loadCallbacks.forEach((cb) => cb());
      loadCallbacks.length = 0;
      resolve();
    };

    script.onerror = () => {
      scriptLoading = false;
      reject(new Error('Failed to load Flutterwave script'));
    };

    document.body.appendChild(script);
  });
}

export async function initiateFlutterwavePayment(
  config: FlutterwaveConfig,
  onSuccess: (response: FlutterwaveResponse) => void,
  onClose: () => void
): Promise<void> {
  await loadFlutterwaveScript();

  if (!window.FlutterwaveCheckout) {
    throw new Error('Flutterwave not loaded');
  }

  window.FlutterwaveCheckout({
    ...config,
    callback: (response) => {
      onSuccess(response);
    },
    onclose: () => {
      onClose();
    },
  });
}

// Helper to generate transaction reference
export function generateTxRef(prefix: string = 'CP'): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

// Payment options for Uganda
export const FLUTTERWAVE_PAYMENT_OPTIONS = {
  all: 'card,mobilemoneyuganda,banktransfer',
  card: 'card',
  mobileMoney: 'mobilemoneyuganda',
  bankTransfer: 'banktransfer',
};
