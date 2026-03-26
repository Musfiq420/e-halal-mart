import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Layout from "@/components/e-halal/Layout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "E-Halal Mart | Your Trusted Halal Grocery Store",
  description: "Premium halal-certified groceries, fresh meat, and organic foods. Experience the finest quality products with halal integrity delivered to your doorstep.",
  keywords: ["Halal", "Grocery", "Organic", "Fresh Meat", "Bengali Food", "E-Halal Mart"],
  authors: [{ name: "E-Halal Mart Team" }],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "E-Halal Mart | Halal Grocery Store",
    description: "Premium halal-certified groceries and organic foods",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}
