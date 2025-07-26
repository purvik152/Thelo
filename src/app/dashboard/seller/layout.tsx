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
    <div className="min-h-screen bg-muted/40">
      <SellerNavbar />
      <main>{children}</main>
    </div>
  );
}
