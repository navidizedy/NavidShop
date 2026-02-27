import NavbarWrapper from "@/components/dashNavbar/NavbarWrapper";
import { ReactQueryProvider } from "@/context/ReactQueryProvider";
import React from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-black text-white">
      <NavbarWrapper />
      <main className="p-6">
        <ReactQueryProvider>{children}</ReactQueryProvider>
      </main>
    </div>
  );
}
