import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext"; // 1. Make sure this import exists
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Thelo",
  description: "B2B Marketplace",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-gradient-to-br from-[#FBF3E5] via-white to-[#FDFBF4]`}>
        {/* 2. This is the most important part. CartProvider MUST wrap {children}. */}
        <CartProvider>
          {children}
        </CartProvider>
        <Toaster
          richColors
          position="bottom-center"
          toastOptions={{
            style: {
              margin: '0 auto 24px auto',
              maxWidth: '400px',
            },
          }}
        />
      </body>
    </html>
  );
}
