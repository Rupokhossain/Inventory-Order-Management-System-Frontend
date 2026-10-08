"use client";

import { useState, useEffect } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  CheckCircle2,
  HelpCircle,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { inquiryService } from "@/services/inquiry.service";
import { useAuthStore } from "@/stores/useAuthStore";

export default function ContactPage() {
  const { user } = useAuthStore();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user?.name && !name) setName(user.name);
    if (user?.email && !email) setEmail(user.email);
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      toast.error("Please fill in all required fields (Name, Email, Message)");
      return;
    }

    setIsSubmitting(true);
    try {
      await inquiryService.submitInquiry({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        subject: subject.trim() || "General Logistics Inquiry",
        message: message.trim(),
      });
      toast.success(
        "Thank you! Your dispatch inquiry has been routed to Admin & Operations."
      );
      if (!user?.name) setName("");
      if (!user?.email) setEmail("");
      setPhone("");
      setSubject("");
      setMessage("");
    } catch (error: any) {
      toast.error(error?.message || "Failed to submit inquiry. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
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
          <div className="p-5 sm:p-6 rounded-2xl bg-card border border-border/80 shadow-xs flex items-start gap-4">
            <div className="h-11 w-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0">
              <MapPin className="h-5 w-5" />
            </div>
            <div className="space-y-1.5 text-sm">
              <h4 className="font-bold text-foreground text-sm sm:text-base">Central Logistics Hub</h4>
              <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
                Level 7, Enterprise Tower, Gulshan-2, Dhaka 1212, Bangladesh
              </p>
            </div>
          </div>

          <div className="p-5 sm:p-6 rounded-2xl bg-card border border-border/80 shadow-xs flex items-start gap-4">
            <div className="h-11 w-11 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold shrink-0">
              <Phone className="h-5 w-5" />
            </div>
            <div className="space-y-1.5 text-sm">
              <h4 className="font-bold text-foreground text-sm sm:text-base">Dispatch Helpline</h4>
              <p className="text-muted-foreground text-xs sm:text-sm">+880 (02) 988-1234 / +880 1700-000000</p>
              <span className="text-xs text-emerald-600 font-semibold block">
                24/7 Priority Emergency Channel
              </span>
            </div>
          </div>

          <div className="p-5 sm:p-6 rounded-2xl bg-card border border-border/80 shadow-xs flex items-start gap-4">
            <div className="h-11 w-11 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center font-bold shrink-0">
              <Mail className="h-5 w-5" />
            </div>
            <div className="space-y-1.5 text-sm">
              <h4 className="font-bold text-foreground text-sm sm:text-base">Electronic Mail</h4>
              <p className="text-muted-foreground text-xs sm:text-sm">support@ioms-logistics.com</p>
              <p className="text-muted-foreground text-xs sm:text-sm">dispatch@ioms-logistics.com</p>
            </div>
          </div>

          <div className="p-5 sm:p-6 rounded-2xl bg-card border border-border/80 shadow-xs flex items-start gap-4">
            <div className="h-11 w-11 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center font-bold shrink-0">
              <Clock className="h-5 w-5" />
            </div>
            <div className="space-y-1.5 text-sm">
              <h4 className="font-bold text-foreground text-sm sm:text-base">Operating Schedule</h4>
              <p className="text-muted-foreground text-xs sm:text-sm">
                Sunday - Thursday: 08:00 AM - 10:00 PM
              </p>
              <p className="text-muted-foreground text-xs sm:text-sm">
                Automated Dispatches: 24/7 Continuous
              </p>
            </div>
          </div>
        </div>

        {/* Right 2 Columns: Contact Form */}
        <div className="lg:col-span-2 p-6 sm:p-8 rounded-2xl bg-card border border-border/80 shadow-xs space-y-6">
          <div className="space-y-1.5 border-b border-border/60 pb-4">
            <h3 className="text-lg sm:text-xl font-bold text-foreground">
              Send an Inquiry to Logistics Operations
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Fill out the parameters below to generate a priority dispatch ticket.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">
                  Your Full Name *
                </label>
                <Input
                  required
                  placeholder="e.g. Tanvir Ahmed"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-11 text-sm bg-background rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">
                  Your Email Address *
                </label>
                <Input
                  required
                  type="email"
                  placeholder="e.g. tanvir@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 text-sm bg-background rounded-xl"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">
                  Phone Number (Optional)
                </label>
                <Input
                  placeholder="e.g. +880 1700-000000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="h-11 text-sm bg-background rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">
                  Subject / Reference ID
                </label>
                <Input
                  placeholder="e.g. Inquiring on Order dispatch"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="h-11 text-sm bg-background rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">
                Detailed Message *
              </label>
              <textarea
                required
                rows={5}
                placeholder="Describe your inquiry, order details, or logistics query..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full rounded-xl border border-input bg-background p-3.5 text-sm shadow-xs focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-11 px-6 gap-2 text-sm font-semibold rounded-xl shadow-xs w-full sm:w-auto"
              >
                <Send className="h-4 w-4" />
                <span>{isSubmitting ? "Routing Ticket..." : "Submit Dispatch Inquiry"}</span>
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
