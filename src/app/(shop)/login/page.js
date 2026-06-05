import { redirect } from "next/navigation";
import { auth } from "@/auth";
import LoginButton from "./LoginButton";

export const metadata = { title: "Sign in · E-Halal Mart" };

export default async function LoginPage({ searchParams }) {
  const { callbackUrl } = await searchParams;
  const target = typeof callbackUrl === "string" && callbackUrl.startsWith("/") ? callbackUrl : "/";

  const session = await auth();
  if (session?.user) redirect(target);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4 text-2xl">☪</div>
        <h1 className="text-xl font-bold text-gray-900">Welcome to E-Halal Mart</h1>
        <p className="text-gray-500 text-sm mt-1 mb-6">Sign in to track orders and check out faster.</p>
        <LoginButton callbackUrl={target} />
        <p className="text-xs text-gray-400 mt-6">
          By continuing you agree to our Terms &amp; Privacy Policy.
        </p>
      </div>
    </div>
  );
}
