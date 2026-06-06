import { requireAdmin } from "@/lib/auth-helpers";
import AdminSidebar from "./AdminSidebar";

export const metadata = {
  title: "Admin · E-Halal Mart",
};

export default async function AdminLayout({ children }) {
  const session = await requireAdmin();

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <AdminSidebar user={session.user} />
      <div className="md:pl-60">
        <main className="min-w-0 p-4 sm:p-6 md:p-8">{children}</main>
      </div>
    </div>
  );
}
