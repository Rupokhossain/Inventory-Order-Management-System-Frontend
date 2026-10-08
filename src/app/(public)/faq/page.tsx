import {
  HelpCircle,
  Truck,
  ShieldCheck,
  CreditCard,
  Boxes,
  RotateCcw,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Frequently Asked Questions • IOMS",
  description: "Common questions and answers regarding order fulfillment, real-time inventory deductions, and payment gateways.",
};

const faqs = [
  {
    q: "How does real-time inventory stock deduction work?",
    a: "Every product in IOMS is tracked in real-time. When a customer confirms an order or authorization succeeds, the system locks and deducts the inventory stock atomically in our database, preventing overselling.",
    icon: Boxes,
  },
  {
    q: "What payment gateways are supported for order fulfillment?",
    a: "IOMS supports official bKash Sandbox PGW tokenized checkout and Credit/Debit Card (Stripe test mode) processing with automated transaction IDs and invoice generation.",
    icon: CreditCard,
  },
  {
    q: "What are the 3 distinct user roles in this platform?",
    a: "IOMS features 3 strict role-based dashboards: Admin (full executive metrics, inventory CRUD, user management), Manager (warehouse dispatch, batch tracking, stock updates), and Customer (browsing catalog, placing orders, tracking dispatches).",
    icon: ShieldCheck,
  },
  {
    q: "How does order dispatch and delivery tracking work?",
    a: "Once an order is placed, Managers can transition orders from Pending to Confirmed, Dispatched, or Delivered. Customers can track live status updates directly inside their Customer Dashboard.",
    icon: Truck,
  },
  {
    q: "What happens if an order is cancelled?",
    a: "If an order is cancelled before dispatch, the allocated stock quantities are immediately returned and restored to the active warehouse catalog.",
    icon: RotateCcw,
  },
];

export default function FAQPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-12">
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
          <HelpCircle className="h-3.5 w-3.5" />
          <span>HELP & KNOWLEDGE BASE</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          Frequently Asked Questions
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
          Everything you need to know about our warehouse inventory control, batch dispatches, and role-based workflows.
        </p>
      </div>

      {/* FAQ Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {faqs.map((faq, i) => {
          const Icon = faq.icon;
          return (
            <div
              key={i}
              className="p-6 rounded-2xl bg-card border border-border/80 shadow-xs space-y-3 hover:border-primary/40 transition-colors"
            >
              <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-foreground">{faq.q}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {faq.a}
              </p>
            </div>
          );
        })}
      </div>

      {/* Help CTA Box */}
      <div className="p-8 rounded-2xl bg-muted/40 border border-border text-center space-y-4 max-w-2xl mx-auto">
        <Sparkles className="h-8 w-8 text-primary mx-auto" />
        <h3 className="text-xl font-bold text-foreground">Still have questions?</h3>
        <p className="text-sm text-muted-foreground">
          Need custom warehouse integration or technical dispatch support? Our operations team is available 24/7.
        </p>
        <Link href="/contact" className="inline-block">
          <Button className="gap-2 font-semibold">
            Contact Operations Support
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
