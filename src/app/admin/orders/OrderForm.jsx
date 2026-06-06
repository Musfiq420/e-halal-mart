"use client";

import { useActionState, useState } from "react";
import Link from "next/link";

const STATUSES = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

const field =
  "w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary";
const labelCls = "block text-sm font-medium text-gray-700 mb-1";

function formatBDT(value) {
  return `৳${Number(value || 0).toLocaleString("en-BD")}`;
}

const emptyRow = () => ({ name: "", unit: "", price: "", quantity: "1" });

export default function OrderForm({ action, order }) {
  const [state, formAction, pending] = useActionState(action, {});
  const isEdit = !!order;

  const [items, setItems] = useState(
    order?.items?.length
      ? order.items.map((it) => ({
          name: it.name,
          unit: it.unit || "",
          price: String(it.price),
          quantity: String(it.quantity),
        }))
      : [emptyRow()]
  );
  const [deliveryFee, setDeliveryFee] = useState(String(order?.deliveryFee ?? 0));

  const updateItem = (i, key, value) =>
    setItems((rows) => rows.map((r, idx) => (idx === i ? { ...r, [key]: value } : r)));
  const addRow = () => setItems((rows) => [...rows, emptyRow()]);
  const removeRow = (i) =>
    setItems((rows) => (rows.length > 1 ? rows.filter((_, idx) => idx !== i) : rows));

  const subtotal = items.reduce(
    (s, r) => s + (Number(r.price) || 0) * (Number(r.quantity) || 0),
    0
  );
  const total = subtotal + (Number(deliveryFee) || 0);

  return (
    <form action={formAction} className="space-y-6 max-w-3xl">
      {isEdit && <input type="hidden" name="id" value={order.id} />}

      {state?.error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
          {state.error}
        </div>
      )}

      {/* Customer */}
      <section className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <h2 className="font-semibold text-gray-900 mb-4">Customer</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Name *</label>
            <input name="customerName" defaultValue={order?.customerName || ""} className={field} required />
          </div>
          <div>
            <label className={labelCls}>Phone *</label>
            <input name="customerPhone" defaultValue={order?.customerPhone || ""} className={field} required />
          </div>
          <div>
            <label className={labelCls}>Email</label>
            <input type="email" name="customerEmail" defaultValue={order?.customerEmail || ""} className={field} />
          </div>
          <div>
            <label className={labelCls}>City *</label>
            <input name="city" defaultValue={order?.city || ""} className={field} required />
          </div>
          <div>
            <label className={labelCls}>Area</label>
            <input name="area" defaultValue={order?.area || ""} className={field} />
          </div>
          <div>
            <label className={labelCls}>Payment Method</label>
            <input
              name="paymentMethod"
              defaultValue={order?.paymentMethod || "Cash on Delivery"}
              className={field}
            />
          </div>
          <div className="md:col-span-2">
            <label className={labelCls}>Address *</label>
            <input name="address" defaultValue={order?.address || ""} className={field} required />
          </div>
          <div className="md:col-span-2">
            <label className={labelCls}>Notes</label>
            <textarea name="notes" rows={2} defaultValue={order?.notes || ""} className={field} />
          </div>
        </div>
      </section>

      {/* Line items */}
      <section className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900">Items</h2>
          <button
            type="button"
            onClick={addRow}
            className="text-sm text-primary font-medium hover:underline"
          >
            + Add item
          </button>
        </div>

        <div className="space-y-3">
          {/* Column labels (desktop) */}
          <div className="hidden sm:grid grid-cols-[1fr_120px_110px_80px_32px] gap-2 text-xs text-gray-400 px-1">
            <span>Product</span>
            <span>Unit</span>
            <span>Price (৳)</span>
            <span>Qty</span>
            <span />
          </div>

          {items.map((row, i) => (
            <div
              key={i}
              className="grid grid-cols-2 sm:grid-cols-[1fr_120px_110px_80px_32px] gap-2 items-center"
            >
              <input
                name="itemName"
                value={row.name}
                onChange={(e) => updateItem(i, "name", e.target.value)}
                placeholder="Product name"
                className={`${field} col-span-2 sm:col-span-1`}
              />
              <input
                name="itemUnit"
                value={row.unit}
                onChange={(e) => updateItem(i, "unit", e.target.value)}
                placeholder="Unit"
                className={field}
              />
              <input
                name="itemPrice"
                type="number"
                min="0"
                value={row.price}
                onChange={(e) => updateItem(i, "price", e.target.value)}
                placeholder="Price"
                className={field}
              />
              <input
                name="itemQty"
                type="number"
                min="1"
                value={row.quantity}
                onChange={(e) => updateItem(i, "quantity", e.target.value)}
                placeholder="Qty"
                className={field}
              />
              <button
                type="button"
                onClick={() => removeRow(i)}
                aria-label="Remove item"
                className="justify-self-end text-gray-400 hover:text-red-500 disabled:opacity-30 p-1"
                disabled={items.length === 1}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="6" y1="6" x2="18" y2="18" />
                  <line x1="18" y1="6" x2="6" y2="18" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Status + totals */}
      <section className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Status</label>
            <select name="status" defaultValue={order?.status || "PENDING"} className={field}>
              {STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelCls}>Delivery Fee (৳)</label>
            <input
              name="deliveryFee"
              type="number"
              min="0"
              value={deliveryFee}
              onChange={(e) => setDeliveryFee(e.target.value)}
              className={field}
            />
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100 space-y-1 text-sm">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal</span>
            <span>{formatBDT(subtotal)}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Delivery Fee</span>
            <span>{formatBDT(Number(deliveryFee) || 0)}</span>
          </div>
          <div className="flex justify-between font-bold text-base text-gray-900 pt-1">
            <span>Total</span>
            <span className="text-primary">{formatBDT(total)}</span>
          </div>
        </div>
      </section>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="px-5 py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark disabled:opacity-60 transition-colors"
        >
          {pending ? "Saving…" : isEdit ? "Update Order" : "Create Order"}
        </button>
        <Link
          href={isEdit ? `/admin/orders/${order.id}` : "/admin/orders"}
          className="px-5 py-2.5 text-sm text-gray-600 hover:text-gray-900"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
