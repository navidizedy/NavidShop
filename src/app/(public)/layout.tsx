import Footer from "@/components/Footer";
import NavbarServer from "@/components/navbar";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <NavbarServer />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
