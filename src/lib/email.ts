import { Resend } from 'resend';

// ----------------------------------------------------------------------

const RESEND_API_KEY = process.env.RESEND_API_KEY;

// Only initialize Resend if API key is available
const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

const FROM_EMAIL = 'ComponentPulse <orders@componentpulse.com>';

// ----------------------------------------------------------------------

export type OrderEmailData = {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  items: {
    productName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  shippingAddress: {
    fullName: string;
    addressLine1: string;
    city: string;
    phone: string;
  };
  paymentMethod: string;
};

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-UG', {
    style: 'currency',
    currency: 'UGX',
    minimumFractionDigits: 0,
  }).format(amount);
}

function getPaymentMethodLabel(method: string): string {
  const labels: Record<string, string> = {
    flutterwave: 'Card/Mobile Money (Flutterwave)',
    mobile_money: 'Mobile Money',
    cash_on_delivery: 'Cash on Delivery',
  };
  return labels[method] || method;
}

// ----------------------------------------------------------------------

export async function sendOrderConfirmationEmail(data: OrderEmailData): Promise<boolean> {
  if (!resend) {
    console.warn('Resend API key not configured. Skipping email.');
    return false;
  }

  try {
    const itemsHtml = data.items
      .map(
        (item) => `
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #eee;">${item.productName}</td>
          <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
          <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">${formatCurrency(item.unitPrice)}</td>
          <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">${formatCurrency(item.totalPrice)}</td>
        </tr>
      `
      )
      .join('');

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #1976d2; margin: 0;">ComponentPulse</h1>
            <p style="color: #666; margin: 5px 0 0;">Your order has been confirmed!</p>
          </div>

          <div style="background: #f8f9fa; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
            <h2 style="margin: 0 0 10px; font-size: 18px;">Order #${data.orderNumber}</h2>
            <p style="margin: 0; color: #666;">Thank you for your order, ${data.customerName}!</p>
          </div>

          <h3 style="border-bottom: 2px solid #1976d2; padding-bottom: 10px;">Order Details</h3>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <thead>
              <tr style="background: #f8f9fa;">
                <th style="padding: 12px; text-align: left;">Product</th>
                <th style="padding: 12px; text-align: center;">Qty</th>
                <th style="padding: 12px; text-align: right;">Price</th>
                <th style="padding: 12px; text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>

          <div style="background: #f8f9fa; border-radius: 8px; padding: 15px; margin-bottom: 20px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <span>Subtotal:</span>
              <span>${formatCurrency(data.subtotal)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <span>Delivery:</span>
              <span>${data.deliveryFee === 0 ? 'FREE' : formatCurrency(data.deliveryFee)}</span>
            </div>
            ${data.discount > 0 ? `
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px; color: #d32f2f;">
              <span>Discount:</span>
              <span>-${formatCurrency(data.discount)}</span>
            </div>
            ` : ''}
            <div style="display: flex; justify-content: space-between; font-size: 18px; font-weight: bold; border-top: 1px solid #ddd; padding-top: 10px; margin-top: 10px;">
              <span>Total:</span>
              <span style="color: #1976d2;">${formatCurrency(data.total)}</span>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
            <div>
              <h3 style="margin: 0 0 10px; font-size: 16px;">Shipping Address</h3>
              <p style="margin: 0; color: #666;">
                ${data.shippingAddress.fullName}<br>
                ${data.shippingAddress.addressLine1}<br>
                ${data.shippingAddress.city}<br>
                ${data.shippingAddress.phone}
              </p>
            </div>
            <div>
              <h3 style="margin: 0 0 10px; font-size: 16px;">Payment Method</h3>
              <p style="margin: 0; color: #666;">${getPaymentMethodLabel(data.paymentMethod)}</p>
            </div>
          </div>

          <div style="text-align: center; padding: 20px; background: #1976d2; color: white; border-radius: 8px;">
            <p style="margin: 0 0 10px;">Track your order status in your account</p>
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/account/orders" style="display: inline-block; background: white; color: #1976d2; padding: 10px 20px; border-radius: 4px; text-decoration: none; font-weight: bold;">View Order</a>
          </div>

          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #999; font-size: 12px;">
            <p>If you have any questions, contact us at support@componentpulse.com</p>
            <p>&copy; ${new Date().getFullYear()} ComponentPulse. All rights reserved.</p>
          </div>
        </body>
      </html>
    `;

    await resend.emails.send({
      from: FROM_EMAIL,
      to: data.customerEmail,
      subject: `Order Confirmed - #${data.orderNumber}`,
      html,
    });

    return true;
  } catch (error) {
    console.error('Failed to send order confirmation email:', error);
    return false;
  }
}

// ----------------------------------------------------------------------

export async function sendOrderStatusUpdateEmail(
  customerEmail: string,
  customerName: string,
  orderNumber: string,
  newStatus: string,
  statusNote?: string
): Promise<boolean> {
  if (!resend) {
    console.warn('Resend API key not configured. Skipping email.');
    return false;
  }

  try {
    const statusLabels: Record<string, { label: string; description: string; color: string }> = {
      confirmed: {
        label: 'Confirmed',
        description: 'Your order has been confirmed and is being prepared.',
        color: '#2196f3',
      },
      processing: {
        label: 'Processing',
        description: 'Your order is being processed and prepared for shipping.',
        color: '#ff9800',
      },
      ready_for_pickup: {
        label: 'Ready for Pickup',
        description: 'Your order is ready and waiting for the delivery partner.',
        color: '#9c27b0',
      },
      out_for_delivery: {
        label: 'Out for Delivery',
        description: 'Your order is on its way! Our delivery partner will contact you shortly.',
        color: '#1976d2',
      },
      delivered: {
        label: 'Delivered',
        description: 'Your order has been delivered. Thank you for shopping with us!',
        color: '#4caf50',
      },
      cancelled: {
        label: 'Cancelled',
        description: 'Your order has been cancelled. If you have any questions, please contact support.',
        color: '#f44336',
      },
    };

    const statusInfo = statusLabels[newStatus] || {
      label: newStatus,
      description: 'Your order status has been updated.',
      color: '#666',
    };

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #1976d2; margin: 0;">ComponentPulse</h1>
          </div>

          <div style="text-align: center; margin-bottom: 30px;">
            <div style="display: inline-block; background: ${statusInfo.color}; color: white; padding: 10px 20px; border-radius: 20px; font-weight: bold;">
              ${statusInfo.label}
            </div>
          </div>

          <div style="background: #f8f9fa; border-radius: 8px; padding: 20px; margin-bottom: 20px; text-align: center;">
            <h2 style="margin: 0 0 10px;">Order #${orderNumber}</h2>
            <p style="margin: 0; color: #666;">Hi ${customerName}, ${statusInfo.description}</p>
            ${statusNote ? `<p style="margin: 10px 0 0; color: #666; font-style: italic;">"${statusNote}"</p>` : ''}
          </div>

          <div style="text-align: center; margin-bottom: 20px;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/account/orders" style="display: inline-block; background: #1976d2; color: white; padding: 12px 24px; border-radius: 4px; text-decoration: none; font-weight: bold;">Track Your Order</a>
          </div>

          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #999; font-size: 12px;">
            <p>If you have any questions, contact us at support@componentpulse.com</p>
            <p>&copy; ${new Date().getFullYear()} ComponentPulse. All rights reserved.</p>
          </div>
        </body>
      </html>
    `;

    await resend.emails.send({
      from: FROM_EMAIL,
      to: customerEmail,
      subject: `Order Update - #${orderNumber} is ${statusInfo.label}`,
      html,
    });

    return true;
  } catch (error) {
    console.error('Failed to send order status update email:', error);
    return false;
  }
}

// ----------------------------------------------------------------------

export async function sendTicketReplyEmail(
  customerEmail: string,
  customerName: string,
  ticketNumber: string,
  ticketSubject: string,
  replyContent: string,
  ticketUrl: string
): Promise<boolean> {
  if (!resend) {
    console.warn('Resend API key not configured. Skipping email.');
    return false;
  }

  try {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #1976d2; margin: 0;">ComponentPulse Support</h1>
          </div>

          <div style="background: #f8f9fa; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
            <h2 style="margin: 0 0 10px; font-size: 18px;">Update on Ticket ${ticketNumber}</h2>
            <p style="margin: 0 0 15px; color: #666;">Hi ${customerName}, support has replied to your ticket "<strong>${ticketSubject}</strong>":</p>
            
            <div style="background: #fff; border-left: 4px solid #1976d2; padding: 15px; border-radius: 4px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
              <p style="margin: 0; white-space: pre-wrap;">${replyContent}</p>
            </div>
          </div>

          <div style="text-align: center; margin-bottom: 20px;">
            <a href="${ticketUrl}" style="display: inline-block; background: #1976d2; color: white; padding: 12px 24px; border-radius: 4px; text-decoration: none; font-weight: bold;">View Ticket & Reply</a>
          </div>

          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #999; font-size: 12px;">
            <p>If you have any questions, you can reply directly on the ticket page.</p>
            <p>&copy; ${new Date().getFullYear()} ComponentPulse. All rights reserved.</p>
          </div>
        </body>
      </html>
    `;

    await resend.emails.send({
      from: FROM_EMAIL,
      to: customerEmail,
      subject: `Re: [${ticketNumber}] ${ticketSubject}`,
      html,
    });

    return true;
  } catch (error) {
    console.error('Failed to send ticket reply email:', error);
    return false;
  }
}


// ----------------------------------------------------------------------

export type TrainingUpdateType = 'launched' | 'updated' | 'coming_soon';

export async function sendTrainingUpdateEmail(
  recipientEmail: string,
  recipientName: string,
  moduleTitle: string,
  updateType: TrainingUpdateType,
  moduleUrl: string
): Promise<boolean> {
  if (!resend) {
    console.warn('Resend API key not configured. Skipping training email.');
    return false;
  }

  const updateConfig: Record<TrainingUpdateType, { subject: string; heading: string; description: string; color: string; buttonLabel: string }> = {
    launched: {
      subject: `🚀 "${moduleTitle}" is now live!`,
      heading: 'Your training module is now live!',
      description: `Great news! The training module <strong>${moduleTitle}</strong> that you subscribed to has officially launched. It&apos;s now available for you to access.`,
      color: '#4caf50',
      buttonLabel: 'Start Learning Now',
    },
    updated: {
      subject: `📚 "${moduleTitle}" has been updated`,
      heading: 'Training module updated',
      description: `The training module <strong>${moduleTitle}</strong> has been updated with new content. Check out the latest materials and improvements.`,
      color: '#1976d2',
      buttonLabel: 'View Updates',
    },
    coming_soon: {
      subject: `Coming Soon: "${moduleTitle}"`,
      heading: 'A new training module is coming soon!',
      description: `We wanted to let you know that <strong>${moduleTitle}</strong> is coming soon. We&apos;ll send you another email as soon as it launches.`,
      color: '#ff9800',
      buttonLabel: 'Preview Module',
    },
  };

  const config = updateConfig[updateType];

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #1976d2; margin: 0;">ComponentPulse</h1>
          <p style="color: #666; margin: 5px 0 0;">Training & Education</p>
        </div>

        <div style="text-align: center; margin-bottom: 24px;">
          <div style="display: inline-block; background: ${config.color}; color: white; padding: 10px 24px; border-radius: 20px; font-weight: bold; font-size: 16px;">
            ${config.heading}
          </div>
        </div>

        <div style="background: #f8f9fa; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
          <p style="margin: 0 0 8px; color: #444;">Hi ${recipientName || 'there'},</p>
          <p style="margin: 0; color: #666;">${config.description}</p>
        </div>

        <div style="text-align: center; margin-bottom: 28px;">
          <a href="${moduleUrl}" style="display: inline-block; background: ${config.color}; color: white; padding: 14px 28px; border-radius: 6px; text-decoration: none; font-weight: bold; font-size: 16px;">${config.buttonLabel}</a>
        </div>

        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #999; font-size: 12px;">
          <p>You received this email because you subscribed to updates for this training module.</p>
          <p>If you have any questions, contact us at <a href="mailto:support@componentpulse.com" style="color: #1976d2;">support@componentpulse.com</a></p>
          <p>&copy; ${new Date().getFullYear()} ComponentPulse. All rights reserved.</p>
        </div>
      </body>
    </html>
  `;

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: recipientEmail,
      subject: config.subject,
      html,
    });
    return true;
  } catch (error) {
    console.error('Failed to send training update email:', error);
    return false;
  }
}

export async function sendProductReviewRequestEmail(
  customerEmail: string,
  customerName: string,
  orderNumber: string,
  items: { id: string; name: string }[]
): Promise<boolean> {
  if (!resend) return false;

  const html = `
    <!DOCTYPE html>
    <html>
      <head><meta charset="utf-8"></head>
      <body style="font-family: sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #1976d2; margin: 0;">ComponentPulse</h1>
          <p style="color: #666;">How did we do?</p>
        </div>

        <p>Hi ${customerName},</p>
        <p>Your order <strong>#${orderNumber}</strong> has been delivered! We hope you love your new components.</p>
        <p>Could you take a minute to review the items you bought? Your feedback helps other engineers make better choices!</p>

        <div style="margin: 30px 0;">
          ${items
      .map(
        (item) => `
            <div style="margin-bottom: 15px; padding: 15px; background: #f8f9fa; border-radius: 8px; display: flex; align-items: center; justify-content: space-between;">
              <span style="font-weight: 500;">${item.name}</span>
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/products/${item.id}" style="background: #1976d2; color: #fff; text-decoration: none; padding: 8px 16px; border-radius: 4px; font-size: 14px;">Leave Review</a>
            </div>
          `
      )
      .join('')}
        </div>

        <p>Thank you for shopping with ComponentPulse!</p>
      </body>
    </html>
  `;

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: customerEmail,
      subject: 'Tell us what you think! ⭐',
      html,
    });
    return true;
  } catch (error) {
    console.error('Failed to send product review email:', error);
    return false;
  }
}
