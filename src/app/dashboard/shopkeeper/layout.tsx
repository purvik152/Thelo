/*
* =================================================================================================
* FILE: src/app/dashboard/shopkeeper/layout.tsx
*
* ACTION: Replace the code in this file.
* The incorrect import for './globals.css' has been removed.
* =================================================================================================
*/
import { Navbar } from '@/components/custom/Navbar';

export default function ShopkeeperLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-[#FBF3E5] via-[#FDFBF4] to-[#F8F2E8] relative">
      {/* Decorative background elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-3"></div>
      <div className="absolute top-32 right-16 w-48 h-48 bg-gradient-to-br from-[#BEA093]/8 to-transparent rounded-full blur-xl"></div>
      <div className="absolute bottom-40 left-16 w-72 h-72 bg-gradient-to-br from-[#D4C4B0]/6 to-transparent rounded-full blur-2xl"></div>

      <Navbar />
      <div className="relative z-10 w-full">
        {children}
      </div>
    </div>
  );
}
