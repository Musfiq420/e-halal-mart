import { requireAdmin } from "@/lib/auth-helpers";
import AdminSidebar from "./AdminSidebar";

export const metadata = {
  title: "Admin · E-Halal Mart",
};

export default async function AdminLayout({ children }) {
  const session = await requireAdmin();

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900">
      <AdminSidebar user={session.user} />
      <main className="flex-1 min-w-0 p-6 md:p-8">{children}</main>
    </div>
  );
}
