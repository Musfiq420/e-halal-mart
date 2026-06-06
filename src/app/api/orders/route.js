import nodemailer from 'nodemailer';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { generateOrderNumber } from '@/lib/orders';

export const runtime = 'nodejs';

const ORDER_RECIPIENT = 'mahfuzaakter4772@gmail.com, mrifat46@gmail.com';

async function persistOrder({ customer, items, summary, userId }) {
  // Only link order items to products that still exist (FK safety).
  const productIds = items
    .map((i) => Number(i.id))
    .filter((id) => Number.isInteger(id));
  const existing = productIds.length
    ? await prisma.product.findMany({
        where: { id: { in: productIds } },
        select: { id: true },
      })
    : [];
  const existingIds = new Set(existing.map((p) => p.id));

  const toInt = (v) => Math.round(Number(v) || 0);

  return prisma.order.create({
    data: {
      orderNumber: generateOrderNumber(),
      userId: userId || null,
      customerName: customer.name,
      customerPhone: customer.phone,
      customerEmail: customer.email || null,
      address: customer.address,
      city: customer.city,
      area: customer.area || null,
      paymentMethod: customer.paymentMethod,
      notes: customer.notes || null,
      itemCount: toInt(summary.itemCount) || items.reduce((s, i) => s + toInt(i.quantity), 0),
      subtotal: toInt(summary.subtotal),
      deliveryFee: toInt(summary.deliveryFee),
      total: toInt(summary.total),
      items: {
        create: items.map((item) => ({
          productId: existingIds.has(Number(item.id)) ? Number(item.id) : null,
          name: item.name,
          unit: item.unit || null,
          price: toInt(item.price),
          quantity: toInt(item.quantity),
        })),
      },
    },
  });
}

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

    // Attach the order to the signed-in user when available (guest checkout otherwise).
    let userId = null;
    try {
      const session = await auth();
      userId = session?.user?.id || null;
    } catch {
      userId = null;
    }

    // Persist the order (primary action).
    const saved = await persistOrder({
      customer: order.customer,
      items,
      summary,
      userId,
    });

    // Send the notification email (best-effort — do not fail the order if it bounces).
    try {
      const transporter = createTransporter();
      if (transporter) {
        await transporter.sendMail({
          from: process.env.MAIL_FROM || process.env.SMTP_USER,
          to: ORDER_RECIPIENT,
          replyTo: order.customer.email || undefined,
          subject: `New E-Halal Mart order ${saved.orderNumber} from ${order.customer.name}`,
          text: buildOrderText(order),
          html: buildOrderHtml(order),
        });
      } else {
        console.warn('Order email skipped: SMTP not configured.');
      }
    } catch (mailError) {
      console.error('Order email failed (order still saved):', mailError);
    }

    return Response.json({ message: 'Order placed.', orderNumber: saved.orderNumber });
  } catch (error) {
    console.error('Order creation failed:', error);
    return Response.json({ message: 'Could not place the order.' }, { status: 500 });
  }
}
