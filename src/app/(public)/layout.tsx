import Footer from "@/components/shared/Footer";
import Navbar from "@/components/shared/Navbar";


export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden">
      <Navbar />
      <main className="flex-1 min-w-0 overflow-x-hidden">{children}</main>
      <Footer />
    </div>
  );
}