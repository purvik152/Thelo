/*
* =================================================================================================
* FILE: src/app/dashboard/seller/layout.tsx
*
* This layout wraps all pages inside the /seller route.
* It ensures the SellerNavbar is always present.
* =================================================================================================
*/
import { SellerNavbar } from "@/components/custom/SellerNavbar";

export default function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-[#FBF3E5] via-[#FDFBF4] to-[#F8F2E8] relative">
      {/* Decorative background elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-3"></div>
      <div className="absolute top-40 left-20 w-64 h-64 bg-gradient-to-br from-[#BEA093]/5 to-transparent rounded-full blur-2xl"></div>
      <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-br from-[#D4C4B0]/5 to-transparent rounded-full blur-2xl"></div>

      <SellerNavbar />

      <main className="w-full flex-grow max-w-7xl relative z-10">
        {children}
      </main>
    </div>
  );
}
