"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-helpers";
import { generateOrderNumber } from "@/lib/orders";
import { logAudit, diff } from "@/lib/audit";

const STATUSES = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

// Scalar order fields tracked in the audit diff on update.
const ORDER_FIELDS = [
  "customerName",
  "customerPhone",
  "customerEmail",
  "address",
  "city",
  "area",
  "paymentMethod",
  "notes",
  "status",
  "deliveryFee",
];

function intOrZero(value) {
  const n = Math.round(Number(value));
  return Number.isFinite(n) && n > 0 ? n : 0;
}

function str(formData, key) {
  return String(formData.get(key) || "").trim();
}

/**
 * Parse customer fields, status, fees and the parallel line-item arrays from
 * the form. Totals are computed server-side — client values are never trusted.
 */
function readOrderData(formData) {
  const customerName = str(formData, "customerName");
  const customerPhone = str(formData, "customerPhone");
  const address = str(formData, "address");
  const city = str(formData, "city");

  if (!customerName) throw new Error("Customer name is required.");
  if (!customerPhone) throw new Error("Customer phone is required.");
  if (!address) throw new Error("Address is required.");
  if (!city) throw new Error("City is required.");

  const statusRaw = str(formData, "status");
  const status = STATUSES.includes(statusRaw) ? statusRaw : "PENDING";

  // Parallel arrays from the dynamic line-item editor.
  const names = formData.getAll("itemName");
  const units = formData.getAll("itemUnit");
  const prices = formData.getAll("itemPrice");
  const qtys = formData.getAll("itemQty");

  const items = [];
  for (let i = 0; i < names.length; i++) {
    const name = String(names[i] || "").trim();
    if (!name) continue; // skip blank rows
    const price = intOrZero(prices[i]);
    const quantity = Math.max(1, intOrZero(qtys[i]) || 1);
    items.push({
      name,
      unit: String(units[i] || "").trim() || null,
      price,
      quantity,
    });
  }

  if (items.length === 0) throw new Error("Add at least one line item.");

  const subtotal = items.reduce((s, it) => s + it.price * it.quantity, 0);
  const itemCount = items.reduce((s, it) => s + it.quantity, 0);
  const deliveryFee = intOrZero(formData.get("deliveryFee"));
  const total = subtotal + deliveryFee;

  return {
    fields: {
      customerName,
      customerPhone,
      customerEmail: str(formData, "customerEmail") || null,
      address,
      city,
      area: str(formData, "area") || null,
      paymentMethod: str(formData, "paymentMethod") || "Cash on Delivery",
      notes: str(formData, "notes") || null,
      status,
      itemCount,
      subtotal,
      deliveryFee,
      total,
    },
    items,
  };
}

export async function createOrder(prevState, formData) {
  await requireAdmin();
  let order;
  try {
    const { fields, items } = readOrderData(formData);
    order = await prisma.order.create({
      data: {
        ...fields,
        orderNumber: generateOrderNumber(),
        items: { create: items },
      },
    });
  } catch (e) {
    return { error: e.message || "Could not create order." };
  }

  await logAudit({
    action: "CREATE",
    entity: "Order",
    entityId: order.id,
    summary: `Created order ${order.orderNumber} (${order.customerName}, ৳${order.total})`,
  });

  revalidatePath("/admin/orders");
  redirect(`/admin/orders/${order.id}`);
}

export async function updateOrder(prevState, formData) {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  if (!id) return { error: "Invalid order id." };

  const existing = await prisma.order.findUnique({ where: { id } });
  if (!existing) return { error: "Order not found." };

  let updated;
  try {
    const { fields, items } = readOrderData(formData);
    // Replace line items wholesale inside a transaction, then recompute totals.
    [, , updated] = await prisma.$transaction([
      prisma.orderItem.deleteMany({ where: { orderId: id } }),
      prisma.orderItem.createMany({
        data: items.map((it) => ({ ...it, orderId: id })),
      }),
      prisma.order.update({ where: { id }, data: fields }),
    ]);
  } catch (e) {
    return { error: e.message || "Could not update order." };
  }

  await logAudit({
    action: "UPDATE",
    entity: "Order",
    entityId: id,
    summary: `Updated order ${existing.orderNumber}`,
    changes: diff(existing, updated, ORDER_FIELDS),
  });

  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${id}`);
  redirect(`/admin/orders/${id}`);
}

export async function updateOrderStatus(formData) {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  const status = String(formData.get("status") || "");
  if (!id || !STATUSES.includes(status)) return;

  const existing = await prisma.order.findUnique({
    where: { id },
    select: { status: true, orderNumber: true },
  });
  if (!existing) return;

  await prisma.order.update({ where: { id }, data: { status } });

  if (existing.status !== status) {
    await logAudit({
      action: "STATUS_UPDATE",
      entity: "Order",
      entityId: id,
      summary: `Order ${existing.orderNumber} status ${existing.status} → ${status}`,
      changes: { status: { from: existing.status, to: status } },
    });
  }

  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${id}`);
}

export async function deleteOrder(formData) {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  if (!id) return;

  const existing = await prisma.order.findUnique({
    where: { id },
    select: { orderNumber: true, customerName: true, total: true },
  });

  const deleted = await prisma.order
    .delete({ where: { id } })
    .then(() => true)
    .catch(() => false);

  if (deleted && existing) {
    await logAudit({
      action: "DELETE",
      entity: "Order",
      entityId: id,
      summary: `Deleted order ${existing.orderNumber} (${existing.customerName}, ৳${existing.total})`,
    });
  }

  revalidatePath("/admin/orders");
  redirect("/admin/orders");
}
