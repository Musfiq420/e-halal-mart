import Link from "next/link";
import OrderForm from "../OrderForm";
import { createOrder } from "../actions";

export const metadata = { title: "New Order · Admin" };

export default function NewOrderPage() {
  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/orders" className="text-sm text-primary hover:underline">← Orders</Link>
        <h1 className="text-2xl font-bold text-gray-900 mt-1">New Order</h1>
        <p className="text-gray-500 text-sm mt-1">Create an order manually.</p>
      </div>
      <OrderForm action={createOrder} />
    </div>
  );
}
