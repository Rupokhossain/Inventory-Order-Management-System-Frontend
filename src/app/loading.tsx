import { Package } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4 px-4">
      <div className="relative flex items-center justify-center">
        <div className="h-16 w-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-sm">
          <Package className="h-8 w-8 animate-pulse text-primary" />
        </div>
        <div className="absolute -inset-2 border-2 border-primary/30 border-t-primary rounded-3xl animate-spin" />
      </div>
      <div className="text-center space-y-1">
        <p className="text-sm font-bold text-foreground">Syncing Live Inventory Feed...</p>
        <p className="text-xs text-muted-foreground">Connecting to IOMS Central Warehouse Hub</p>
      </div>
    </div>
  );
}
