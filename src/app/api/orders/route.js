import nodemailer from 'nodemailer';

export const runtime = 'nodejs';

const ORDER_RECIPIENT = 'mahfuzaakter4772@gmail.com, mrifat46@gmail.com';

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function formatCurrency(value) {
  return `BDT ${Number(value || 0).toLocaleString('en-BD')}`;
}

function getRequiredString(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function createTransporter() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user,
      pass,
    },
  });
}

function buildOrderText({ customer, items, summary }) {
  const itemLines = items
    .map((item) => {
      const lineTotal = Number(item.price || 0) * Number(item.quantity || 0);
      return `- ${item.name} x ${item.quantity} (${item.unit || 'unit'}): ${formatCurrency(lineTotal)}`;
    })
    .join('\n');

  return [
    'New E-Halal Mart order',
    '',
    'Customer',
    `Name: ${customer.name}`,
    `Phone: ${customer.phone}`,
    `Email: ${customer.email || 'Not provided'}`,
    `City: ${customer.city}`,
    `Area: ${customer.area || 'Not provided'}`,
    `Address: ${customer.address}`,
    `Payment Method: ${customer.paymentMethod}`,
    `Notes: ${customer.notes || 'None'}`,
    '',
    'Items',
    itemLines,
    '',
    'Summary',
    `Item Count: ${summary.itemCount}`,
    `Subtotal: ${formatCurrency(summary.subtotal)}`,
    `Delivery Fee: ${summary.deliveryFee === 0 ? 'Free' : formatCurrency(summary.deliveryFee)}`,
    `Promo Code: ${summary.promoCode || 'None'}`,
    `Total: ${formatCurrency(summary.total)}`,
  ].join('\n');
}

function buildOrderHtml({ customer, items, summary }) {
  const itemRows = items
    .map((item) => {
      const lineTotal = Number(item.price || 0) * Number(item.quantity || 0);

      return `
        <tr>
          <td style="padding:8px;border-bottom:1px solid #e5e7eb;">${escapeHtml(item.name)}</td>
          <td style="padding:8px;border-bottom:1px solid #e5e7eb;">${escapeHtml(item.unit || 'unit')}</td>
          <td style="padding:8px;border-bottom:1px solid #e5e7eb;text-align:center;">${escapeHtml(item.quantity)}</td>
          <td style="padding:8px;border-bottom:1px solid #e5e7eb;text-align:right;">${escapeHtml(formatCurrency(item.price))}</td>
          <td style="padding:8px;border-bottom:1px solid #e5e7eb;text-align:right;">${escapeHtml(formatCurrency(lineTotal))}</td>
        </tr>
      `;
    })
    .join('');

  return `
    <div style="font-family:Arial,sans-serif;color:#111827;line-height:1.5;">
      <h2 style="margin:0 0 16px;">New E-Halal Mart Order</h2>

      <h3 style="margin:24px 0 8px;">Customer</h3>
      <table style="border-collapse:collapse;width:100%;max-width:640px;">
        <tr><td style="padding:6px 0;font-weight:700;width:150px;">Name</td><td>${escapeHtml(customer.name)}</td></tr>
        <tr><td style="padding:6px 0;font-weight:700;">Phone</td><td>${escapeHtml(customer.phone)}</td></tr>
        <tr><td style="padding:6px 0;font-weight:700;">Email</td><td>${escapeHtml(customer.email || 'Not provided')}</td></tr>
        <tr><td style="padding:6px 0;font-weight:700;">City</td><td>${escapeHtml(customer.city)}</td></tr>
        <tr><td style="padding:6px 0;font-weight:700;">Area</td><td>${escapeHtml(customer.area || 'Not provided')}</td></tr>
        <tr><td style="padding:6px 0;font-weight:700;">Address</td><td>${escapeHtml(customer.address)}</td></tr>
        <tr><td style="padding:6px 0;font-weight:700;">Payment</td><td>${escapeHtml(customer.paymentMethod)}</td></tr>
        <tr><td style="padding:6px 0;font-weight:700;">Notes</td><td>${escapeHtml(customer.notes || 'None')}</td></tr>
      </table>

      <h3 style="margin:24px 0 8px;">Items</h3>
      <table style="border-collapse:collapse;width:100%;max-width:760px;">
        <thead>
          <tr style="background:#f9fafb;">
            <th style="padding:8px;text-align:left;border-bottom:1px solid #e5e7eb;">Product</th>
            <th style="padding:8px;text-align:left;border-bottom:1px solid #e5e7eb;">Unit</th>
            <th style="padding:8px;text-align:center;border-bottom:1px solid #e5e7eb;">Qty</th>
            <th style="padding:8px;text-align:right;border-bottom:1px solid #e5e7eb;">Price</th>
            <th style="padding:8px;text-align:right;border-bottom:1px solid #e5e7eb;">Total</th>
          </tr>
        </thead>
        <tbody>${itemRows}</tbody>
      </table>

      <h3 style="margin:24px 0 8px;">Summary</h3>
      <table style="border-collapse:collapse;width:100%;max-width:420px;">
        <tr><td style="padding:6px 0;">Item Count</td><td style="padding:6px 0;text-align:right;">${escapeHtml(summary.itemCount)}</td></tr>
        <tr><td style="padding:6px 0;">Subtotal</td><td style="padding:6px 0;text-align:right;">${escapeHtml(formatCurrency(summary.subtotal))}</td></tr>
        <tr><td style="padding:6px 0;">Delivery Fee</td><td style="padding:6px 0;text-align:right;">${summary.deliveryFee === 0 ? 'Free' : escapeHtml(formatCurrency(summary.deliveryFee))}</td></tr>
        <tr><td style="padding:6px 0;">Promo Code</td><td style="padding:6px 0;text-align:right;">${escapeHtml(summary.promoCode || 'None')}</td></tr>
        <tr><td style="padding:8px 0;font-weight:700;border-top:1px solid #e5e7eb;">Total</td><td style="padding:8px 0;text-align:right;font-weight:700;border-top:1px solid #e5e7eb;">${escapeHtml(formatCurrency(summary.total))}</td></tr>
      </table>
    </div>
  `;
}

export async function POST(request) {
  try {
    const body = await request.json();
    const customer = body?.customer || {};
    const items = Array.isArray(body?.items) ? body.items : [];
    const summary = body?.summary || {};

    const order = {
      customer: {
        name: getRequiredString(customer.name),
        phone: getRequiredString(customer.phone),
        email: getRequiredString(customer.email),
        address: getRequiredString(customer.address),
        city: getRequiredString(customer.city),
        area: getRequiredString(customer.area),
        paymentMethod: getRequiredString(customer.paymentMethod) || 'Cash on Delivery',
        notes: getRequiredString(customer.notes),
      },
      items,
      summary,
    };

    if (!order.customer.name || !order.customer.phone || !order.customer.address || !order.customer.city) {
      return Response.json({ message: 'Please fill in all required checkout fields.' }, { status: 400 });
    }

    if (items.length === 0) {
      return Response.json({ message: 'Your cart is empty.' }, { status: 400 });
    }

    const transporter = createTransporter();

    if (!transporter) {
      return Response.json({ message: 'Email service is not configured.' }, { status: 500 });
    }

    await transporter.sendMail({
      from: process.env.MAIL_FROM || process.env.SMTP_USER,
      to: ORDER_RECIPIENT,
      replyTo: order.customer.email || undefined,
      subject: `New E-Halal Mart order from ${order.customer.name}`,
      text: buildOrderText(order),
      html: buildOrderHtml(order),
    });

    return Response.json({ message: 'Order email sent.' });
  } catch (error) {
    console.error('Order email failed:', error);
    return Response.json({ message: 'Could not send the order email.' }, { status: 500 });
  }
}
