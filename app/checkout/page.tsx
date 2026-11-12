"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useCase } from "@/context/case-context";
import { loadRazorpayScript } from "@/lib/load-razorpay";

const SHIPPING_REGIONS = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Delhi NCR",
  "Chandigarh",
  "Jammu & Kashmir",
  "Ladakh",
  "Puducherry",
];

interface RazorpaySuccessResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface RazorpayFailureResponse {
  error?: {
    code?: string;
    description?: string;
    source?: string;
    step?: string;
    reason?: string;
  };
}

interface RazorpayInstance {
  open: () => void;
  on: (event: string, callback: (res: RazorpayFailureResponse) => void) => void;
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  image?: string;
  order_id: string;
  handler: (response: RazorpaySuccessResponse) => void | Promise<void>;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: Record<string, string>;
  theme?: {
    color?: string;
  };
  modal?: {
    ondismiss?: () => void;
  };
}

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

export default function CheckoutPage() {
  const router = useRouter();
  const {
    items,
    subtotal,
    totalCount,
    updateQuantity,
    removeFromCase,
    clearCase,
    giftNote,
    setGiftNote,
  } = useCase();

  // Form State
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    apartment: "",
    city: "",
    state: "Maharashtra",
    pincode: "",
    giftNote: giftNote || "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [isRazorpayReady, setIsRazorpayReady] = useState(false);
  const [isSandboxNoticeOpen, setIsSandboxNoticeOpen] = useState(false);

  // Pre-load Razorpay checkout script
  useEffect(() => {
    loadRazorpayScript().then((loaded) => {
      setIsRazorpayReady(loaded);
    });
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "giftNote") setGiftNote(value);
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    if (paymentError) {
      setPaymentError(null);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ""))) {
      newErrors.phone = "Please enter a valid 10-digit mobile number";
    }

    if (!formData.address.trim()) newErrors.address = "Delivery address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.pincode.trim()) {
      newErrors.pincode = "PIN code is required";
    } else if (!/^\d{6}$/.test(formData.pincode.trim())) {
      newErrors.pincode = "Please enter a valid 6-digit PIN code";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    if (items.length === 0) return;

    setIsProcessing(true);
    setPaymentError(null);

    try {
      const orderRef = `LGP-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

      // 1. Create order on server via Razorpay API
      const res = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          customer: formData,
          giftNote: formData.giftNote,
          customOrderId: orderRef,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Unable to initiate payment session.");
      }

      const orderData = await res.json();

      // Case A: Live or Test Razorpay Keys are active
      if (orderData.configured && orderData.razorpayOrderId) {
        // Ensure script is loaded
        const scriptLoaded = await loadRazorpayScript();
        if (!scriptLoaded || typeof window === "undefined" || !window.Razorpay) {
          throw new Error("Unable to connect to Razorpay payment gateway. Please check your network connection.");
        }

        const options: RazorpayOptions = {
          key: orderData.keyId,
          amount: orderData.amount,
          currency: orderData.currency || "INR",
          name: "Ligero Parfum",
          description: `Acquisition ${orderData.orderReference}`,
          order_id: orderData.razorpayOrderId,
          image: "/images/hero/ligero-parfum-cutout.webp",
          handler: async function (response: RazorpaySuccessResponse) {
            try {
              // 2. Verify payment cryptographic signature on server
              const verifyRes = await fetch("/api/razorpay/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  orderReference: orderData.orderReference,
                }),
              });

              const verifyData = await verifyRes.json();

              if (!verifyRes.ok || !verifyData.verified) {
                throw new Error(
                  verifyData.error || "Payment signature verification failed. Please contact concierge."
                );
              }

              // Store order metadata for confirmation
              const orderRecord = {
                orderId: orderData.orderReference,
                paymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id,
                date: new Date().toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                }),
                customer: formData,
                items,
                subtotal,
                status: "Verified (Razorpay)",
              };

              sessionStorage.setItem("ligero_last_order", JSON.stringify(orderRecord));
              clearCase();
              router.push(
                `/checkout/success?orderId=${orderData.orderReference}&paymentId=${response.razorpay_payment_id}`
              );
            } catch (err) {
              setIsProcessing(false);
              setPaymentError(
                err instanceof Error ? err.message : "Payment verification failed."
              );
            }
          },
          prefill: {
            name: formData.fullName,
            email: formData.email,
            contact: formData.phone,
          },
          notes: {
            orderReference: orderData.orderReference,
            city: formData.city,
            pincode: formData.pincode,
          },
          theme: {
            color: "#A64B24", // Burnt Apricot
          },
          modal: {
            ondismiss: function () {
              setIsProcessing(false);
            },
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.on("payment.failed", function (failRes: RazorpayFailureResponse) {
          setIsProcessing(false);
          setPaymentError(
            failRes.error?.description || "Payment was declined or cancelled. Please try again."
          );
        });
        rzp.open();
        return;
      }

      // Case B: Razorpay keys are not yet provided in .env.local
      // Graceful test simulation mode for developer preview
      setIsSandboxNoticeOpen(true);
      await new Promise((resolve) => setTimeout(resolve, 1200));

      const orderRecord = {
        orderId: orderRef,
        paymentId: `sim_rzp_${Date.now().toString().slice(-8)}`,
        date: new Date().toLocaleDateString("en-IN", {
          day: "numeric",
          month: "long",
          year: "numeric",
        }),
        customer: formData,
        items,
        subtotal,
        status: "Verified (Sandbox Simulation)",
      };

      sessionStorage.setItem("ligero_last_order", JSON.stringify(orderRecord));
      clearCase();
      router.push(`/checkout/success?orderId=${orderRef}&paymentId=${orderRecord.paymentId}`);
    } catch (err) {
      setIsProcessing(false);
      setPaymentError(
        err instanceof Error
          ? err.message
          : "Unable to complete transaction. Please check your details or write to sales@ligeroparfum.com."
      );
    }
  };

  // Empty state
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-aube-base text-aube-text">
        <header className="border-b border-aube-hairline bg-nav-silk/80 backdrop-blur-md">
          <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 sm:px-10">
            <Link href="/" className="font-display text-2xl font-light tracking-wide text-aube-text">
              Ligero Parfum
            </Link>
            <Link
              href="/collection"
              className="text-xs uppercase tracking-[0.2em] text-aube-text-muted hover:text-aube-accent"
            >
              The Collection
            </Link>
          </div>
        </header>

        <main className="mx-auto flex max-w-xl flex-col items-center justify-center px-6 py-32 text-center">
          <h1 className="font-display text-4xl font-light italic text-aube-text sm:text-5xl">
            Your case is currently empty.
          </h1>
          <p className="mt-4 text-base text-aube-text-muted">
            Explore seven rare extrait de parfums and olfactory objects.
          </p>
          <Link
            href="/collection"
            className="mt-8 border border-aube-text bg-aube-text px-8 py-3.5 text-xs uppercase tracking-[0.22em] text-aube-base transition-all hover:border-aube-accent hover:bg-aube-accent"
          >
            Explore The Collection
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-aube-base text-aube-text">
      {/* Checkout Header */}
      <header className="border-b border-aube-hairline bg-nav-silk/90 backdrop-blur-md">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 sm:px-10">
          <Link href="/" className="font-display text-2xl font-light tracking-wide text-aube-text">
            Ligero Parfum
          </Link>

          <div className="flex items-center gap-6">
            <div className="hidden sm:flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-aube-text-muted">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <span>Razorpay 256-bit Encrypted</span>
            </div>
            <Link
              href="/collection"
              className="text-xs uppercase tracking-[0.2em] text-aube-text-muted hover:text-aube-accent"
            >
              ← Back to Shop
            </Link>
          </div>
        </div>
      </header>

      {/* Main Checkout Area */}
      <main className="mx-auto max-w-7xl px-6 py-12 sm:px-10 lg:py-16">
        <div className="mb-10">
          <h1 className="font-display text-4xl font-light italic tracking-tight sm:text-5xl">
            Complete Your Case
          </h1>
          <p className="mt-2 text-sm text-aube-text-muted">
            Complimentary tracked delivery. No customer account required.
          </p>
        </div>

        {paymentError && (
          <div className="mb-8 border border-aube-error/40 bg-aube-error/10 p-4 text-xs text-aube-error flex items-start gap-3">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="flex-shrink-0 mt-0.5">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <div>
              <p className="font-medium">Transaction Notice</p>
              <p className="mt-1">{paymentError}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Left Column: Guest Delivery Details Form */}
          <div className="lg:col-span-7">
            <form onSubmit={handlePayment} className="space-y-10">
              {/* Section 1: Contact */}
              <div className="border-b border-aube-hairline pb-8">
                <h2 className="font-display text-2xl font-light text-aube-text">
                  1. Contact Information
                </h2>
                <p className="mt-1 text-xs text-aube-text-muted">
                  Used for order receipts and dispatch tracking.
                </p>

                <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label className="block text-[11px] uppercase tracking-[0.16em] text-aube-text-muted">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="e.g. Radhika Sharma"
                      className="mt-2 w-full border border-aube-hairline bg-aube-surface px-4 py-3 text-sm text-aube-text placeholder-aube-text-muted/50 focus:border-aube-accent focus:outline-none"
                    />
                    {errors.fullName && (
                      <p className="mt-1 text-xs text-aube-error">{errors.fullName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-[0.16em] text-aube-text-muted">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="radhika@example.com"
                      className="mt-2 w-full border border-aube-hairline bg-aube-surface px-4 py-3 text-sm text-aube-text placeholder-aube-text-muted/50 focus:border-aube-accent focus:outline-none"
                    />
                    {errors.email && (
                      <p className="mt-1 text-xs text-aube-error">{errors.email}</p>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] uppercase tracking-[0.16em] text-aube-text-muted">
                      Mobile Number (for Courier SMS updates) *
                    </label>
                    <div className="mt-2 flex">
                      <span className="flex items-center border border-r-0 border-aube-hairline bg-aube-surface/60 px-3 text-xs font-medium text-aube-text-muted">
                        +91
                      </span>
                      <input
                        type="tel"
                        name="phone"
                        maxLength={10}
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="98765 43210"
                        className="w-full border border-aube-hairline bg-aube-surface px-4 py-3 text-sm text-aube-text placeholder-aube-text-muted/50 focus:border-aube-accent focus:outline-none"
                      />
                    </div>
                    {errors.phone && (
                      <p className="mt-1 text-xs text-aube-error">{errors.phone}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Section 2: Delivery Address */}
              <div className="border-b border-aube-hairline pb-8">
                <h2 className="font-display text-2xl font-light text-aube-text">
                  2. Delivery Address
                </h2>
                <p className="mt-1 text-xs text-aube-text-muted">
                  Dispatched in discrete luxury protective packaging.
                </p>

                <div className="mt-6 space-y-5">
                  <div>
                    <label className="block text-[11px] uppercase tracking-[0.16em] text-aube-text-muted">
                      Street Address & Building *
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Flat / Villa number, building name, street"
                      className="mt-2 w-full border border-aube-hairline bg-aube-surface px-4 py-3 text-sm text-aube-text placeholder-aube-text-muted/50 focus:border-aube-accent focus:outline-none"
                    />
                    {errors.address && (
                      <p className="mt-1 text-xs text-aube-error">{errors.address}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-[0.16em] text-aube-text-muted">
                      Apartment / Suite / Landmark (Optional)
                    </label>
                    <input
                      type="text"
                      name="apartment"
                      value={formData.apartment}
                      onChange={handleInputChange}
                      placeholder="e.g. Near Rosewood Club"
                      className="mt-2 w-full border border-aube-hairline bg-aube-surface px-4 py-3 text-sm text-aube-text placeholder-aube-text-muted/50 focus:border-aube-accent focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                    <div>
                      <label className="block text-[11px] uppercase tracking-[0.16em] text-aube-text-muted">
                        City *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="City"
                        className="mt-2 w-full border border-aube-hairline bg-aube-surface px-4 py-3 text-sm text-aube-text placeholder-aube-text-muted/50 focus:border-aube-accent focus:outline-none"
                      />
                      {errors.city && (
                        <p className="mt-1 text-xs text-aube-error">{errors.city}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-[0.16em] text-aube-text-muted">
                        State *
                      </label>
                      <select
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className="mt-2 w-full border border-aube-hairline bg-aube-surface px-3 py-3 text-sm text-aube-text focus:border-aube-accent focus:outline-none"
                      >
                        {SHIPPING_REGIONS.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-[0.16em] text-aube-text-muted">
                        PIN Code *
                      </label>
                      <input
                        type="text"
                        name="pincode"
                        maxLength={6}
                        value={formData.pincode}
                        onChange={handleInputChange}
                        placeholder="400001"
                        className="mt-2 w-full border border-aube-hairline bg-aube-surface px-4 py-3 text-sm text-aube-text placeholder-aube-text-muted/50 focus:border-aube-accent focus:outline-none"
                      />
                      {errors.pincode && (
                        <p className="mt-1 text-xs text-aube-error">{errors.pincode}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 3: Complimentary Gifting Note */}
              <div className="border-b border-aube-hairline pb-8">
                <h2 className="font-display text-2xl font-light text-aube-text">
                  3. Gifting & Special Instructions
                </h2>
                <p className="mt-1 text-xs text-aube-text-muted">
                  Optional handwritten archival card included inside the parcel.
                </p>

                <div className="mt-4">
                  <textarea
                    rows={3}
                    name="giftNote"
                    value={formData.giftNote}
                    onChange={handleInputChange}
                    placeholder="Enter an optional personal note to be written on the presentation card..."
                    className="w-full border border-aube-hairline bg-aube-surface px-4 py-3 text-sm text-aube-text placeholder-aube-text-muted/50 focus:border-aube-accent focus:outline-none"
                  />
                </div>
              </div>

              {/* Section 4: Payment Confirmation via Razorpay */}
              <div>
                <div className="rounded-[2px] border border-aube-hairline bg-aube-surface p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-xs uppercase tracking-[0.16em] text-aube-text">
                          Razorpay Secure Payment
                        </span>
                        <span className="bg-aube-accent/10 text-aube-accent text-[9px] uppercase tracking-[0.15em] px-2 py-0.5 border border-aube-accent/20">
                          Instant
                        </span>
                      </div>
                      <p className="mt-1.5 text-xs text-aube-text-muted">
                        Supports UPI (Google Pay, PhonePe, Paytm, BHIM), Credit/Debit Cards (Visa, Mastercard, RuPay, Amex), and 50+ NetBanking portals.
                      </p>
                    </div>
                  </div>

                  {/* Payment Methods Badges */}
                  <div className="mt-4 flex flex-wrap items-center gap-2 pt-3 border-t border-aube-hairline/60 text-[10px] uppercase tracking-[0.15em] text-aube-text-muted">
                    <span className="border border-aube-hairline px-2 py-1 bg-aube-base/40">UPI</span>
                    <span className="border border-aube-hairline px-2 py-1 bg-aube-base/40">Google Pay</span>
                    <span className="border border-aube-hairline px-2 py-1 bg-aube-base/40">PhonePe</span>
                    <span className="border border-aube-hairline px-2 py-1 bg-aube-base/40">Paytm</span>
                    <span className="border border-aube-hairline px-2 py-1 bg-aube-base/40">Cards</span>
                    <span className="border border-aube-hairline px-2 py-1 bg-aube-base/40">NetBanking</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="mt-6 flex w-full items-center justify-center border border-aube-text bg-aube-text py-4 text-xs uppercase tracking-[0.24em] text-aube-base transition-all hover:border-aube-accent hover:bg-aube-accent disabled:opacity-60"
                >
                  {isProcessing ? (
                    <span className="flex items-center gap-2">
                      <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-aube-base border-t-transparent" />
                      Connecting to Razorpay...
                    </span>
                  ) : (
                    `Pay ₹${subtotal.toLocaleString("en-IN")} via Razorpay`
                  )}
                </button>

                <p className="mt-4 text-center text-[11px] leading-relaxed text-aube-text-muted">
                  By placing your order, you agree to Ligero Parfum's{" "}
                  <Link href="/legal/terms" className="underline hover:text-aube-accent">
                    Terms of Sale
                  </Link>{" "}
                  and{" "}
                  <Link href="/legal/privacy" className="underline hover:text-aube-accent">
                    Privacy Policy
                  </Link>
                  .
                </p>
              </div>
            </form>
          </div>

          {/* Right Column: Case Summary Sidebar */}
          <div className="lg:col-span-5">
            <div className="sticky top-28 border border-aube-hairline bg-aube-surface p-6 sm:p-8">
              <div className="flex items-baseline justify-between border-b border-aube-hairline pb-4">
                <h2 className="font-display text-2xl font-light text-aube-text">
                  Your Case
                </h2>
                <span className="text-xs uppercase tracking-[0.18em] text-aube-text-muted">
                  {totalCount} {totalCount === 1 ? "Item" : "Items"}
                </span>
              </div>

              {/* Items List */}
              <ul className="my-6 divide-y divide-aube-hairline/60">
                {items.map((item) => (
                  <li key={item.slug} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                    <div className="relative h-20 w-16 flex-shrink-0 overflow-hidden border border-aube-hairline/80 bg-aube-base/50">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="64px"
                        className="object-contain p-2"
                      />
                    </div>
                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between">
                          <span className="font-display text-lg font-light text-aube-text">
                            {item.name}
                          </span>
                          <span className="font-body text-sm font-medium text-aube-text">
                            ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                          </span>
                        </div>
                        <p className="text-[11px] uppercase tracking-[0.16em] text-aube-text-muted">
                          {item.volume}
                        </p>
                      </div>

                      <div className="mt-2 flex items-center justify-between text-xs">
                        <div className="flex items-center border border-aube-hairline">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.slug, -1)}
                            className="flex h-6 w-6 items-center justify-center hover:text-aube-accent"
                          >
                            −
                          </button>
                          <span className="w-6 text-center font-medium">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.slug, 1)}
                            className="flex h-6 w-6 items-center justify-center hover:text-aube-accent"
                          >
                            +
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeFromCase(item.slug)}
                          className="text-[10px] uppercase tracking-[0.16em] text-aube-text-muted hover:text-aube-accent"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              {/* Price Calculation */}
              <div className="border-t border-aube-hairline pt-5 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-aube-text-muted">Subtotal</span>
                  <span className="text-aube-text">₹{subtotal.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-aube-text-muted">Domestic Shipping</span>
                  <span className="text-aube-accent font-medium">Complimentary</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-aube-text-muted">Applicable Taxes</span>
                  <span className="text-aube-text-muted text-xs">Included in price</span>
                </div>

                <div className="border-t border-aube-hairline/80 pt-4 flex items-baseline justify-between">
                  <span className="text-xs uppercase tracking-[0.2em] font-medium text-aube-text">
                    Total
                  </span>
                  <span className="font-display text-3xl font-light text-aube-text">
                    ₹{subtotal.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {/* Reassurances */}
              <div className="mt-8 border-t border-aube-hairline/60 pt-5 space-y-3 text-[11px] text-aube-text-muted">
                <div className="flex items-center gap-2.5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  <span>Dispatched in 2 business days from the atelier</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <span>Express courier with end-to-end SMS tracking</span>
                </div>
                <div className="flex items-center gap-2.5 text-aube-accent">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  <span>Powered by Razorpay Verified Checkout</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
