"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
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
    addToCase,
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
  const [postPaymentStage, setPostPaymentStage] = useState<
    "idle" | "verifying" | "redirecting" | "failed"
  >("idle");
  const paymentSettledRef = useRef(false);

  // Restore saved guest checkout draft when returning from a failed payment attempt
  useEffect(() => {
    try {
      const savedDraft = sessionStorage.getItem("ligero_checkout_draft");
      if (savedDraft) {
        const parsed = JSON.parse(savedDraft);
        if (parsed && typeof parsed === "object") {
          setFormData((prev) => ({
            ...prev,
            fullName: typeof parsed.fullName === "string" ? parsed.fullName : prev.fullName,
            email: typeof parsed.email === "string" ? parsed.email : prev.email,
            phone: typeof parsed.phone === "string" ? parsed.phone : prev.phone,
            address: typeof parsed.address === "string" ? parsed.address : prev.address,
            apartment: typeof parsed.apartment === "string" ? parsed.apartment : prev.apartment,
            city: typeof parsed.city === "string" ? parsed.city : prev.city,
            state: typeof parsed.state === "string" ? parsed.state : prev.state,
            pincode: typeof parsed.pincode === "string" ? parsed.pincode : prev.pincode,
            giftNote: typeof parsed.giftNote === "string" ? parsed.giftNote : prev.giftNote,
          }));
        }
      }
    } catch {
      // Ignore sessionStorage unavailable
    }
  }, []);

  // Pre-load Razorpay checkout script and prefetch status pages for instant handoff
  useEffect(() => {
    loadRazorpayScript();
    router.prefetch("/checkout/success");
    router.prefetch("/checkout/failed");
  }, [router]);

  const redirectToFailurePage = ({
    message,
    code,
    step,
    source,
    orderReference,
    cancelled = false,
  }: {
    message: string;
    code?: string;
    step?: string;
    source?: string;
    orderReference?: string;
    cancelled?: boolean;
  }) => {
    if (paymentSettledRef.current) return;
    paymentSettledRef.current = true;

    setPostPaymentStage("failed");
    setPaymentError(message);

    try {
      sessionStorage.setItem("ligero_checkout_draft", JSON.stringify(formData));
      sessionStorage.setItem(
        "ligero_last_payment_failure",
        JSON.stringify({
          reason: message,
          code,
          step,
          source,
          cancelled,
          orderReference,
          amount: subtotal,
          itemCount: totalCount,
          timestamp: new Date().toISOString(),
        })
      );
    } catch {
      // Ignore sessionStorage unavailable
    }

    const failParams = new URLSearchParams();
    if (orderReference) failParams.set("orderId", orderReference);
    if (code) failParams.set("code", code);
    if (cancelled) failParams.set("cancelled", "1");

    const query = failParams.toString();
    setTimeout(() => {
      router.push(query ? `/checkout/failed?${query}` : "/checkout/failed");
    }, 550);
  };

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
    if (items.length === 0) {
      setPaymentError("Your case is currently empty. Add a fragrance or Discovery Set before completing payment.");
      return;
    }

    paymentSettledRef.current = false;
    setIsProcessing(true);
    setPaymentError(null);

    try {
      sessionStorage.setItem("ligero_checkout_draft", JSON.stringify(formData));
    } catch {
      // Ignore sessionStorage unavailable
    }

    try {
      // 1. Create order on server via Razorpay API
      const res = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          customer: formData,
          giftNote: formData.giftNote,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Unable to initiate payment session.");
      }

      const orderData = await res.json();

      // Open Razorpay Standard Checkout modal
      const resolvedOrderId = orderData.order_id || orderData.razorpayOrderId;
      if (!orderData.configured || !resolvedOrderId) {
        throw new Error(orderData.error || "Payment gateway is not configured. Please contact support.");
      }

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded || typeof window === "undefined" || !window.Razorpay) {
        throw new Error("Unable to connect to Razorpay payment gateway. Please check your network connection.");
      }

      const checkoutImage =
        typeof window !== "undefined" ? `${window.location.origin}/icon.png` : "/icon.png";

      const options: RazorpayOptions = {
        key: orderData.keyId || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
        amount: orderData.amount,
        currency: orderData.currency || "INR",
        name: "Ligero Parfum",
        description: `Acquisition ${orderData.orderReference}`,
        order_id: resolvedOrderId,
        image: checkoutImage,
        handler: async function (response: RazorpaySuccessResponse) {
          setPostPaymentStage("verifying");
          try {
            // 2. Verify payment cryptographic signature on server and persist paid order
            const verifyRes = await fetch("/api/razorpay/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderReference: orderData.orderReference,
                customer: formData,
                items,
                giftNote: formData.giftNote,
              }),
            });

            const verifyData = await verifyRes.json();

            if (!verifyRes.ok || !verifyData.verified) {
              throw new Error(
                verifyData.error || "Payment signature verification failed. Please contact concierge."
              );
            }

            paymentSettledRef.current = true;
            setPostPaymentStage("redirecting");

            // Store order metadata for confirmation using server-verified total
            const verifiedSubtotal =
              typeof verifyData.totalInr === "number" && verifyData.totalInr > 0
                ? verifyData.totalInr
                : typeof orderData.amount === "number" && orderData.amount > 0
                  ? Math.round(orderData.amount / 100)
                  : subtotal;

            const orderRecord = {
              orderId: verifyData.orderReference || orderData.orderReference,
              paymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              date: new Date().toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
              }),
              customer: formData,
              items,
              subtotal: verifiedSubtotal,
              giftNote: formData.giftNote,
              status: "Verified (Razorpay)",
            };

            try {
              sessionStorage.setItem("ligero_last_order", JSON.stringify(orderRecord));
              sessionStorage.removeItem("ligero_checkout_draft");
              sessionStorage.removeItem("ligero_last_payment_failure");
            } catch {
              // Ignore sessionStorage unavailable
            }

            const successParams = new URLSearchParams({
              orderId: verifyData.orderReference || orderData.orderReference,
              paymentId: response.razorpay_payment_id,
            });
            if (verifyData.lookupToken) {
              successParams.set("token", verifyData.lookupToken);
            }
            router.replace(`/checkout/success?${successParams.toString()}`);
          } catch (err) {
            redirectToFailurePage({
              message:
                err instanceof Error ? err.message : "Payment verification failed.",
              code: "VERIFICATION_FAILED",
              orderReference: orderData.orderReference,
            });
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
            redirectToFailurePage({
              message:
                "Payment was cancelled before completion. Your case and details are saved so you can retry whenever you are ready.",
              code: "PAYMENT_CANCELLED",
              orderReference: orderData.orderReference,
              cancelled: true,
            });
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (failRes: RazorpayFailureResponse) {
        redirectToFailurePage({
          message:
            failRes.error?.description ||
            "Your payment was declined by the bank or payment provider. Please try again or choose another payment method.",
          code: failRes.error?.code,
          step: failRes.error?.step,
          source: failRes.error?.source,
          orderReference: orderData.orderReference,
        });
      });
      rzp.open();
    } catch (err) {
      setIsProcessing(false);
      setPaymentError(
        err instanceof Error
          ? err.message
          : "Unable to complete transaction. Please check your details or write to sales@ligeroparfums.com."
      );
    }
  };

  return (
    <div className="min-h-screen bg-aube-base text-aube-text">
      {/* Full-Screen Post-Payment Verification & Transition Loader */}
      {postPaymentStage !== "idle" && (
        <div
          role="status"
          aria-live="polite"
          className={`fixed inset-0 z-50 flex flex-col items-center justify-center px-6 text-center backdrop-blur-md ${
            postPaymentStage === "redirecting"
              ? "bg-[#edf6ef]/95"
              : postPaymentStage === "failed"
              ? "bg-[#fcf0ee]/95"
              : "bg-aube-base/95"
          }`}
        >
          <div
            className={`w-full max-w-md border p-8 sm:p-12 shadow-[0_12px_44px_rgba(43,33,24,0.10)] ${
              postPaymentStage === "redirecting"
                ? "border-[#b5d8bf] bg-[#fcfefb]"
                : postPaymentStage === "failed"
                ? "border-[#e7bbb5] bg-[#fffcfb]"
                : "border-aube-hairline bg-aube-surface"
            }`}
          >
            <div
              className={`mx-auto flex h-12 w-12 items-center justify-center rounded-full border ${
                postPaymentStage === "redirecting"
                  ? "border-[#86c99a] bg-[#e3f5e8]"
                  : postPaymentStage === "failed"
                  ? "border-[#eba9a1] bg-[#fde9e7]"
                  : "border-aube-accent/30 bg-aube-accent/10"
              }`}
            >
              <span
                className={`h-5 w-5 animate-spin rounded-full border-2 border-t-transparent ${
                  postPaymentStage === "redirecting"
                    ? "border-[#14532d]"
                    : postPaymentStage === "failed"
                    ? "border-[#991b22]"
                    : "border-aube-accent"
                }`}
              />
            </div>

            <p
              className={`mt-6 text-[10px] font-medium uppercase tracking-[0.24em] ${
                postPaymentStage === "redirecting"
                  ? "text-[#156237]"
                  : postPaymentStage === "failed"
                  ? "text-[#991b22]"
                  : "text-aube-accent"
              }`}
            >
              {postPaymentStage === "redirecting"
                ? "Payment Verified"
                : postPaymentStage === "failed"
                ? "Transaction Unsuccessful"
                : "Ligero Parfum Atelier"}
            </p>

            <h2
              className={`mt-2 font-display text-3xl font-light italic sm:text-4xl ${
                postPaymentStage === "redirecting"
                  ? "text-[#113320]"
                  : postPaymentStage === "failed"
                  ? "text-[#581117]"
                  : "text-aube-text"
              }`}
            >
              {postPaymentStage === "verifying" && "Verifying your payment..."}
              {postPaymentStage === "redirecting" && "Scent, set in motion..."}
              {postPaymentStage === "failed" && "Payment not completed..."}
            </h2>

            <p
              className={`mt-3 text-xs leading-relaxed ${
                postPaymentStage === "redirecting"
                  ? "text-[#3d5e4b]"
                  : postPaymentStage === "failed"
                  ? "text-[#7a3b3e]"
                  : "text-aube-text-muted"
              }`}
            >
              {postPaymentStage === "verifying" &&
                "Confirming payment signature with Razorpay and recording your order in the atelier ledger."}
              {postPaymentStage === "redirecting" &&
                "Payment verified. Opening your order confirmation..."}
              {postPaymentStage === "failed" &&
                "Opening transaction details with your saved case..."}
            </p>
          </div>
        </div>
      )}

      {/* Checkout Header */}
      <header className="border-b border-aube-hairline bg-nav-silk/90 backdrop-blur-md">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 sm:px-10">
          <Link href="/" className="font-display text-2xl font-light tracking-wide text-aube-text">
            Ligero Parfum
          </Link>

          <div className="flex items-center gap-6">
            <Link
              href="/collection"
              className="inline-flex min-h-11 items-center text-xs uppercase tracking-[0.2em] text-aube-text-muted hover:text-aube-accent"
            >
              ← Back to Shop
            </Link>
          </div>
        </div>
      </header>

      {/* Main Checkout Area */}
      <main className="mx-auto max-w-7xl px-5 py-8 sm:px-10 sm:py-12 lg:py-16">
        <div className="mb-6 sm:mb-10">
          <h1 className="font-display text-3xl font-light italic tracking-tight sm:text-5xl">
            Complete Your Case
          </h1>
          <p className="mt-2 text-sm text-aube-text-muted">
            Complimentary tracked delivery. No customer account required.
          </p>
        </div>

        {/* Collapsible Mobile Order Summary */}
        <details className="group mb-6 border border-aube-hairline bg-aube-surface lg:hidden">
          <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between px-4 py-3 text-xs uppercase tracking-[0.18em] text-aube-text">
            <span>
              Order Summary · {totalCount} {totalCount === 1 ? "Item" : "Items"}
            </span>
            <span className="flex items-center gap-2 font-body font-semibold">
              ₹{subtotal.toLocaleString("en-IN")}
              <span aria-hidden="true" className="text-sm text-aube-text-muted transition-transform group-open:rotate-45">
                +
              </span>
            </span>
          </summary>
          <div className="border-t border-aube-hairline px-4 py-4">
            {items.length === 0 ? (
              <p className="text-xs text-aube-text-muted">
                Your case is empty.{" "}
                <Link href="/collection" className="underline text-aube-text">
                  Explore The Collection
                </Link>
              </p>
            ) : (
              <ul className="divide-y divide-aube-hairline/60 text-xs">
                {items.map((item) => (
                  <li key={item.slug} className="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0">
                    <span className="truncate font-display text-base font-light text-aube-text">
                      {item.name} × {item.quantity}
                    </span>
                    <span className="shrink-0 font-body font-medium text-aube-text">
                      ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </details>

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
                    <label
                      htmlFor="fullName"
                      className="block text-[11px] uppercase tracking-[0.16em] text-aube-text-muted"
                    >
                      Full Name *
                    </label>
                    <input
                      id="fullName"
                      type="text"
                      name="fullName"
                      autoComplete="name"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="e.g. Radhika Sharma"
                      className="mt-2 w-full border border-aube-hairline bg-aube-surface px-4 py-3 text-base text-aube-text placeholder-aube-text-muted/50 focus:border-aube-accent focus:outline-none sm:text-sm"
                    />
                    {errors.fullName && (
                      <p className="mt-1 text-xs text-aube-error">{errors.fullName}</p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-[11px] uppercase tracking-[0.16em] text-aube-text-muted"
                    >
                      Email Address *
                    </label>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      autoComplete="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="radhika@example.com"
                      className="mt-2 w-full border border-aube-hairline bg-aube-surface px-4 py-3 text-base text-aube-text placeholder-aube-text-muted/50 focus:border-aube-accent focus:outline-none sm:text-sm"
                    />
                    {errors.email && (
                      <p className="mt-1 text-xs text-aube-error">{errors.email}</p>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <label
                      htmlFor="phone"
                      className="block text-[11px] uppercase tracking-[0.16em] text-aube-text-muted"
                    >
                      Mobile Number (for Courier Delivery Coordination) *
                    </label>
                    <div className="mt-2 flex">
                      <span className="flex items-center border border-r-0 border-aube-hairline bg-aube-surface/60 px-3 text-xs font-medium text-aube-text-muted">
                        +91
                      </span>
                      <input
                        id="phone"
                        type="tel"
                        name="phone"
                        autoComplete="tel-national"
                        maxLength={10}
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="98765 43210"
                        className="w-full border border-aube-hairline bg-aube-surface px-4 py-3 text-base text-aube-text placeholder-aube-text-muted/50 focus:border-aube-accent focus:outline-none sm:text-sm"
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
                    <label
                      htmlFor="address"
                      className="block text-[11px] uppercase tracking-[0.16em] text-aube-text-muted"
                    >
                      Street Address & Building *
                    </label>
                    <input
                      id="address"
                      type="text"
                      name="address"
                      autoComplete="street-address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Flat / Villa number, building name, street"
                      className="mt-2 w-full border border-aube-hairline bg-aube-surface px-4 py-3 text-base text-aube-text placeholder-aube-text-muted/50 focus:border-aube-accent focus:outline-none sm:text-sm"
                    />
                    {errors.address && (
                      <p className="mt-1 text-xs text-aube-error">{errors.address}</p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="apartment"
                      className="block text-[11px] uppercase tracking-[0.16em] text-aube-text-muted"
                    >
                      Apartment / Suite / Landmark (Optional)
                    </label>
                    <input
                      id="apartment"
                      type="text"
                      name="apartment"
                      autoComplete="address-line2"
                      value={formData.apartment}
                      onChange={handleInputChange}
                      placeholder="e.g. Near Rosewood Club"
                      className="mt-2 w-full border border-aube-hairline bg-aube-surface px-4 py-3 text-base text-aube-text placeholder-aube-text-muted/50 focus:border-aube-accent focus:outline-none sm:text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                    <div>
                      <label
                        htmlFor="city"
                        className="block text-[11px] uppercase tracking-[0.16em] text-aube-text-muted"
                      >
                        City *
                      </label>
                      <input
                        id="city"
                        type="text"
                        name="city"
                        autoComplete="address-level2"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="City"
                        className="mt-2 w-full border border-aube-hairline bg-aube-surface px-4 py-3 text-base text-aube-text placeholder-aube-text-muted/50 focus:border-aube-accent focus:outline-none sm:text-sm"
                      />
                      {errors.city && (
                        <p className="mt-1 text-xs text-aube-error">{errors.city}</p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="state"
                        className="block text-[11px] uppercase tracking-[0.16em] text-aube-text-muted"
                      >
                        State *
                      </label>
                      <select
                        id="state"
                        name="state"
                        autoComplete="address-level1"
                        value={formData.state}
                        onChange={handleInputChange}
                        className="mt-2 w-full border border-aube-hairline bg-aube-surface px-3 py-3 text-base text-aube-text focus:border-aube-accent focus:outline-none sm:text-sm"
                      >
                        {SHIPPING_REGIONS.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="pincode"
                        className="block text-[11px] uppercase tracking-[0.16em] text-aube-text-muted"
                      >
                        PIN Code *
                      </label>
                      <input
                        id="pincode"
                        type="text"
                        name="pincode"
                        inputMode="numeric"
                        autoComplete="postal-code"
                        maxLength={6}
                        value={formData.pincode}
                        onChange={handleInputChange}
                        placeholder="400001"
                        className="mt-2 w-full border border-aube-hairline bg-aube-surface px-4 py-3 text-base text-aube-text placeholder-aube-text-muted/50 focus:border-aube-accent focus:outline-none sm:text-sm"
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
                <label
                  htmlFor="giftNote"
                  className="block font-display text-2xl font-light text-aube-text"
                >
                  3. Gifting & Special Instructions
                </label>
                <p className="mt-1 text-xs text-aube-text-muted">
                  Optional handwritten archival card included inside the parcel.
                </p>

                <div className="mt-4">
                  <textarea
                    id="giftNote"
                    rows={3}
                    name="giftNote"
                    value={formData.giftNote}
                    onChange={handleInputChange}
                    placeholder="Enter an optional personal note to be written on the presentation card..."
                    className="w-full border border-aube-hairline bg-aube-surface px-4 py-3 text-base text-aube-text placeholder-aube-text-muted/50 focus:border-aube-accent focus:outline-none sm:text-sm"
                  />
                </div>
              </div>

              {/* Section 4: Payment Confirmation via Razorpay */}
              <div>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="flex w-full items-center justify-center border border-aube-text bg-aube-text py-4 text-xs uppercase tracking-[0.24em] text-aube-base transition-all hover:border-aube-accent hover:bg-aube-accent disabled:opacity-60"
                >
                  {isProcessing ? (
                    <span className="flex items-center gap-2">
                      <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-aube-base border-t-transparent" />
                      Connecting to Razorpay...
                    </span>
                  ) : (
                    `Pay ₹${subtotal.toLocaleString("en-IN")} with Razorpay`
                  )}
                </button>

                <div className="mt-3 flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.16em] text-aube-text-muted">
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    aria-hidden="true"
                  >
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  <span>Secured by Razorpay</span>
                </div>

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
          <aside aria-label="Order Summary" className="lg:col-span-5">
            <div className="sticky top-28 border border-aube-hairline bg-aube-surface p-6 sm:p-8">
              <div className="flex items-baseline justify-between border-b border-aube-hairline pb-4">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-aube-text-muted">
                    Order Summary
                  </p>
                  <h2 className="mt-1 font-display text-2xl font-light text-aube-text">
                    Your Case
                  </h2>
                </div>
                <span className="text-xs uppercase tracking-[0.18em] text-aube-text-muted tabular-nums">
                  {totalCount} {totalCount === 1 ? "Item" : "Items"}
                </span>
              </div>

              {/* Items List or Clean Empty State */}
              {items.length === 0 ? (
                <div className="my-6 border border-dashed border-aube-hairline bg-aube-base/40 p-6 text-center">
                  <p className="font-display text-xl font-light italic text-aube-text">
                    Your case is currently empty.
                  </p>
                  <p className="mt-2 text-xs text-aube-text-muted">
                    Add a 50 ml flacon or begin with The Discovery Set before checking out.
                  </p>
                  <div className="mt-5 flex flex-col gap-2.5">
                    <button
                      type="button"
                      onClick={() =>
                        addToCase({
                          slug: "discovery-set",
                          name: "The Discovery Set",
                          price: 999,
                          volume: "7 × 10 ml",
                          image: "/images/objects/discovery-set-floating.webp",
                        })
                      }
                      className="min-h-11 border border-aube-text bg-aube-text px-5 py-2.5 text-[10.5px] uppercase tracking-[0.2em] text-aube-base transition-colors hover:border-aube-accent hover:bg-aube-accent"
                    >
                      Add Discovery Set · ₹999
                    </button>
                    <Link
                      href="/collection"
                      className="inline-flex min-h-11 items-center justify-center border border-aube-hairline px-5 py-2.5 text-[10.5px] uppercase tracking-[0.2em] text-aube-text transition-colors hover:border-aube-text"
                    >
                      Explore The Collection
                    </Link>
                  </div>
                </div>
              ) : (
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
                          <div className="flex items-start justify-between gap-2">
                            <span className="font-display text-lg font-light text-aube-text">
                              {item.name}
                            </span>
                            <span className="font-body text-sm font-medium tabular-nums text-aube-text">
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
                              aria-label="Decrease quantity"
                              onClick={() => updateQuantity(item.slug, -1)}
                              className="flex h-11 w-11 min-h-11 min-w-11 items-center justify-center text-sm hover:text-aube-accent"
                            >
                              −
                            </button>
                            <span className="w-8 text-center font-medium tabular-nums">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              aria-label="Increase quantity"
                              onClick={() => updateQuantity(item.slug, 1)}
                              className="flex h-11 w-11 min-h-11 min-w-11 items-center justify-center text-sm hover:text-aube-accent"
                            >
                              +
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeFromCase(item.slug)}
                            className="inline-flex min-h-11 items-center px-2 text-[10px] uppercase tracking-[0.16em] text-aube-text-muted hover:text-aube-accent"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              {/* Price Calculation */}
              <div className="border-t border-aube-hairline pt-5 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-aube-text-muted">Subtotal</span>
                  <span className="tabular-nums text-aube-text">₹{subtotal.toLocaleString("en-IN")}</span>
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
                  <span className="font-display text-3xl font-light tabular-nums text-aube-text">
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
                  <span>Express courier with email tracking updates</span>
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
          </aside>
        </div>
      </main>
    </div>
  );
}
