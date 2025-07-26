/*
* =================================================================================================
* FILE: src/app/dashboard/shopkeeper/layout.tsx
*
* This layout wraps all pages inside the /shopkeeper route.
* It ensures the Navbar is always present.
* =================================================================================================
*/
import { Navbar } from "@/components/custom/Navbar";

export default function ShopkeeperLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-muted/40">
      <Navbar />
      <main>{children}</main>
    </div>
  );
}
