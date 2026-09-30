"use client";

import { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  CheckCircle2,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success(
        "Thank you! Your dispatch inquiry has been routed to our logistics desk."
      );
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    }, 600);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 space-y-12">
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
          <MessageSquare className="h-3.5 w-3.5" />
          <span>SUPPORT & LOGISTICS DISPATCH</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
          Contact Central Command
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Have an inquiry regarding consignment dispatches, warehouse stock, or payment reconciliation? Reach out directly.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Contact Cards */}
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-card border border-border/80 shadow-xs flex items-start gap-4">
            <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0">
              <MapPin className="h-5 w-5" />
            </div>
            <div className="space-y-1 text-xs">
              <h4 className="font-bold text-foreground">Central Logistics Hub</h4>
              <p className="text-muted-foreground">
                Level 7, Enterprise Tower, Gulshan-2, Dhaka 1212, Bangladesh
              </p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-card border border-border/80 shadow-xs flex items-start gap-4">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold shrink-0">
              <Phone className="h-5 w-5" />
            </div>
            <div className="space-y-1 text-xs">
              <h4 className="font-bold text-foreground">Dispatch Helpline</h4>
              <p className="text-muted-foreground">+880 (02) 988-1234 / +880 1700-000000</p>
              <span className="text-[10px] text-emerald-600 font-semibold block">
                24/7 Priority Emergency Channel
              </span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-card border border-border/80 shadow-xs flex items-start gap-4">
            <div className="h-10 w-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center font-bold shrink-0">
              <Mail className="h-5 w-5" />
            </div>
            <div className="space-y-1 text-xs">
              <h4 className="font-bold text-foreground">Electronic Mail</h4>
              <p className="text-muted-foreground">support@ioms-logistics.com</p>
              <p className="text-muted-foreground">dispatch@ioms-logistics.com</p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-card border border-border/80 shadow-xs flex items-start gap-4">
            <div className="h-10 w-10 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center font-bold shrink-0">
              <Clock className="h-5 w-5" />
            </div>
            <div className="space-y-1 text-xs">
              <h4 className="font-bold text-foreground">Operating Schedule</h4>
              <p className="text-muted-foreground">
                Sunday - Thursday: 08:00 AM - 10:00 PM
              </p>
              <p className="text-muted-foreground">
                Automated Dispatches: 24/7 Continuous
              </p>
            </div>
          </div>
        </div>

        {/* Right 2 Columns: Contact Form */}
        <div className="lg:col-span-2 p-6 sm:p-8 rounded-2xl bg-card border border-border/80 shadow-xs space-y-6">
          <div className="space-y-1 border-b border-border/60 pb-4">
            <h3 className="text-base font-bold text-foreground">
              Send an Inquiry to Logistics Operations
            </h3>
            <p className="text-xs text-muted-foreground">
              Fill out the parameters below to generate a priority dispatch ticket.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Your Full Name *
                </label>
                <Input
                  required
                  placeholder="e.g. Tanvir Ahmed"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="text-xs bg-background"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Your Email Address *
                </label>
                <Input
                  required
                  type="email"
                  placeholder="e.g. tanvir@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="text-xs bg-background"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Subject / Reference ID
              </label>
              <Input
                placeholder="e.g. Inquiring on Order #a680ce25 dispatch status"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="text-xs bg-background"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Detailed Message *
              </label>
              <textarea
                required
                rows={5}
                placeholder="Describe your inquiry, order details, or logistics query..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full rounded-md border border-input bg-background p-3 text-xs shadow-xs focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="gap-2 text-xs font-semibold shadow-xs"
              >
                <Send className="h-3.5 w-3.5" />
                <span>{isSubmitting ? "Routing Ticket..." : "Submit Dispatch Inquiry"}</span>
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
