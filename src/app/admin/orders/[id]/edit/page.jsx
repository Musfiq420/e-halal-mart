import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import OrderForm from "../../OrderForm";
import { updateOrder } from "../../actions";

export const metadata = { title: "Edit Order · Admin" };

export default async function EditOrderPage({ params }) {
  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  });

  if (!order) notFound();

  return (
    <div className="space-y-6">
      <div>
        <Link href={`/admin/orders/${order.id}`} className="text-sm text-primary hover:underline">
          ← {order.orderNumber}
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 mt-1">Edit Order</h1>
      </div>
      <OrderForm action={updateOrder} order={order} />
    </div>
  );
}
