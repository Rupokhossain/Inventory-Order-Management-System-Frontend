import Footer from "@/components/shared/Footer";
import Navbar from "@/components/shared/Navbar";


export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col overflow-x-clip">
      <Navbar />
      <main className="flex-1 min-w-0 overflow-x-clip">{children}</main>
      <Footer />
    </div>
  );
}