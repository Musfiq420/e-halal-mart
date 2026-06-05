import Link from "next/link";
import Image from "next/image";
import { requireUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "My Account · E-Halal Mart" };
export const dynamic = "force-dynamic";

function formatBDT(value) {
  return `৳${Number(value || 0).toLocaleString("en-BD")}`;
}

const statusTone = {
  PENDING: "bg-amber-100 text-amber-700",
  CONFIRMED: "bg-blue-100 text-blue-700",
  PROCESSING: "bg-indigo-100 text-indigo-700",
  SHIPPED: "bg-purple-100 text-purple-700",
  DELIVERED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-600",
};

export default async function AccountPage() {
  const session = await requireUser("/account");
  const user = session.user;

  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Profile */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center gap-4">
        {user.image ? (
          <Image src={user.image} alt={user.name || "User"} width={56} height={56} className="rounded-full" />
        ) : (
          <span className="w-14 h-14 rounded-full bg-primary text-white flex items-center justify-center text-xl font-semibold">
            {(user.name || user.email || "U").charAt(0).toUpperCase()}
          </span>
        )}
        <div className="min-w-0">
          <h1 className="text-xl font-bold text-gray-900 truncate">{user.name}</h1>
          <p className="text-gray-500 text-sm truncate">{user.email}</p>
        </div>
        {user.role === "ADMIN" && (
          <Link href="/admin" className="ml-auto px-4 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary-dark transition-colors">
            Admin Panel
          </Link>
        )}
      </div>

      {/* Orders */}
      <h2 className="text-lg font-bold text-gray-900 mt-8 mb-4">My Orders</h2>

      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
          <p className="text-gray-500 mb-4">You haven&apos;t placed any orders yet.</p>
          <Link href="/products" className="inline-block px-5 py-2.5 bg-primary text-white text-sm rounded-lg hover:bg-primary-dark transition-colors">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <div>
                  <p className="font-semibold text-gray-900">{order.orderNumber}</p>
                  <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleString("en-GB")}</p>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusTone[order.status] || "bg-gray-100 text-gray-600"}`}>
                  {order.status}
                </span>
              </div>
              <div className="text-sm text-gray-600 space-y-1">
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <span>{item.name} × {item.quantity}</span>
                    <span>{formatBDT(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-100 mt-3 pt-3 flex justify-between text-sm font-bold">
                <span>Total ({order.itemCount} items)</span>
                <span className="text-primary">{formatBDT(order.total)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
