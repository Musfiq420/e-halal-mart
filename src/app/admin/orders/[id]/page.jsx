import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateOrderStatus, deleteOrder } from "../actions";

const STATUSES = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

function formatBDT(value) {
  return `৳${Number(value || 0).toLocaleString("en-BD")}`;
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between gap-4 py-1.5 text-sm">
      <span className="text-gray-500">{label}</span>
      <span className="text-gray-900 text-right">{value || "—"}</span>
    </div>
  );
}

export default async function AdminOrderDetailPage({ params }) {
  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true, user: true },
  });

  if (!order) notFound();

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/admin/orders" className="text-sm text-primary hover:underline">← Orders</Link>
          <h1 className="text-2xl font-bold text-gray-900 mt-1">{order.orderNumber}</h1>
          <p className="text-gray-500 text-sm mt-1">
            {new Date(order.createdAt).toLocaleString("en-GB")}
          </p>
        </div>
        <form action={deleteOrder}>
          <input type="hidden" name="id" value={order.id} />
          <button type="submit" className="px-4 py-2 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors">
            Delete Order
          </button>
        </form>
      </div>

      {/* Status update */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <h2 className="font-semibold text-gray-900 mb-3">Status</h2>
        <form action={updateOrderStatus} className="flex items-center gap-3">
          <input type="hidden" name="id" value={order.id} />
          <select
            name="status"
            defaultValue={order.status}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <button type="submit" className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition-colors">
            Update
          </button>
        </form>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Customer */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h2 className="font-semibold text-gray-900 mb-3">Customer</h2>
          <Row label="Name" value={order.customerName} />
          <Row label="Phone" value={order.customerPhone} />
          <Row label="Email" value={order.customerEmail} />
          <Row label="Account" value={order.user?.email || "Guest"} />
          <Row label="City" value={order.city} />
          <Row label="Area" value={order.area} />
          <Row label="Address" value={order.address} />
          <Row label="Payment" value={order.paymentMethod} />
          <Row label="Notes" value={order.notes} />
        </div>

        {/* Summary */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h2 className="font-semibold text-gray-900 mb-3">Summary</h2>
          <Row label="Items" value={order.itemCount} />
          <Row label="Subtotal" value={formatBDT(order.subtotal)} />
          <Row label="Delivery Fee" value={order.deliveryFee === 0 ? "Free" : formatBDT(order.deliveryFee)} />
          <div className="border-t border-gray-100 mt-2 pt-2 flex justify-between text-base font-bold">
            <span>Total</span>
            <span className="text-primary">{formatBDT(order.total)}</span>
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b border-gray-100">
              <th className="px-5 py-3 font-medium">Product</th>
              <th className="px-5 py-3 font-medium">Unit</th>
              <th className="px-5 py-3 font-medium text-center">Qty</th>
              <th className="px-5 py-3 font-medium text-right">Price</th>
              <th className="px-5 py-3 font-medium text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item) => (
              <tr key={item.id} className="border-b border-gray-50 last:border-0">
                <td className="px-5 py-3 text-gray-900">{item.name}</td>
                <td className="px-5 py-3 text-gray-600">{item.unit || "—"}</td>
                <td className="px-5 py-3 text-center">{item.quantity}</td>
                <td className="px-5 py-3 text-right">{formatBDT(item.price)}</td>
                <td className="px-5 py-3 text-right">{formatBDT(item.price * item.quantity)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
