'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';

const links = [
  { href: '/admin', label: 'Dashboard', exact: true },
  { href: '/admin/products', label: 'Products' },
  { href: '/admin/categories', label: 'Categories' },
  { href: '/admin/orders', label: 'Orders' },
];

export default function AdminSidebar({ user }) {
  const pathname = usePathname();

  const isActive = (link) =>
    link.exact ? pathname === link.href : pathname.startsWith(link.href);

  return (
    <aside className="w-60 flex-shrink-0 bg-dark-green text-white flex flex-col min-h-screen sticky top-0">
      <div className="p-5 border-b border-white/10">
        <Link href="/admin" className="font-bold text-lg">E-Halal Admin</Link>
        <p className="text-[11px] text-light-green mt-0.5">Management Console</p>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              isActive(link)
                ? 'bg-primary text-white'
                : 'text-white/70 hover:bg-white/10 hover:text-white'
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="p-3 border-t border-white/10">
        <Link
          href="/"
          className="block px-4 py-2 rounded-lg text-sm text-white/70 hover:bg-white/10 hover:text-white transition-colors"
        >
          ← View Store
        </Link>
        <div className="px-4 pt-3 pb-1">
          <p className="text-xs text-white/80 truncate">{user?.name}</p>
          <p className="text-[11px] text-white/50 truncate">{user?.email}</p>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="w-full text-left px-4 py-2 rounded-lg text-sm text-red-300 hover:bg-white/10 transition-colors"
        >
          Sign out
        </button>
      </div>
    </aside>
  );
}
