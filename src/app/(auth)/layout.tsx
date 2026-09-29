import Link from "next/link";
import { Package } from "lucide-react";
import { ThemeToggle } from "@/components/shared/ThemeToggle";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      {/* Top Bar with Logo & Theme Switch */}
      <div className="container mx-auto flex items-center justify-between p-4 sm:p-6 max-w-7xl">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Package className="h-4 w-4" />
          </div>
          <span>IOMS.</span>
        </Link>
        <ThemeToggle />
      </div>

      {/* Centered Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}