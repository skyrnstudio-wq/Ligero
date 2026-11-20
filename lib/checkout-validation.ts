export const MAX_QUANTITY_PER_SKU = 50;
export const MAX_DISTINCT_ITEMS = 25;

export const SHIPPING_REGIONS = [
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
] as const;

export interface CheckoutCustomerPayload {
  fullName?: unknown;
  email?: unknown;
  phone?: unknown;
  address?: unknown;
  apartment?: unknown;
  city?: unknown;
  state?: unknown;
  pincode?: unknown;
}

export interface ValidatedCheckoutCustomer {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  apartment: string;
  city: string;
  state: string;
  pincode: string;
}

export type CustomerValidationResult =
  | { valid: true; customer: ValidatedCheckoutCustomer; errors: Record<string, string> }
  | { valid: false; error: string; errors: Record<string, string> };

/**
 * Normalizes an Indian mobile number input (handling optional +91, 91, 0 prefix,
 * spaces, and hyphens from browser autofill) to its 10-digit national form when possible.
 */
export function normalizeIndianPhone(raw: unknown): string {
  if (typeof raw !== "string") return "";
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) {
    return digits.slice(2);
  }
  if (digits.length === 11 && digits.startsWith("0")) {
    return digits.slice(1);
  }
  return digits;
}

/**
 * Validates and normalizes checkout customer & Indian shipping details identically
 * on both the client form and the server order-creation endpoint.
 */
export function validateCheckoutCustomer(
  input: CheckoutCustomerPayload | null | undefined
): CustomerValidationResult {
  const errors: Record<string, string> = {};

  const fullName = typeof input?.fullName === "string" ? input.fullName.trim() : "";
  const email = typeof input?.email === "string" ? input.email.trim() : "";
  const phone = normalizeIndianPhone(input?.phone);
  const address = typeof input?.address === "string" ? input.address.trim() : "";
  const apartment = typeof input?.apartment === "string" ? input.apartment.trim() : "";
  const city = typeof input?.city === "string" ? input.city.trim() : "";
  const state = typeof input?.state === "string" ? input.state.trim() : "";
  const pincode = typeof input?.pincode === "string" ? input.pincode.trim() : "";

  if (!fullName || fullName.length < 2) {
    errors.fullName = "Full name is required";
  } else if (fullName.length > 120) {
    errors.fullName = "Full name is too long";
  }

  if (!email) {
    errors.email = "Email is required";
  } else if (email.length > 120 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Please enter a valid email address";
  }

  if (!phone) {
    errors.phone = "Phone number is required";
  } else if (!/^\d{10}$/.test(phone)) {
    errors.phone = "Please enter a valid 10-digit mobile number";
  }

  if (!address || address.length < 4) {
    errors.address = "Delivery address is required";
  } else if (address.length > 300) {
    errors.address = "Delivery address is too long";
  }

  if (!city || city.length < 2) {
    errors.city = "City is required";
  } else if (city.length > 80) {
    errors.city = "City name is too long";
  }

  if (!state || state.length < 2 || state.length > 80) {
    errors.state = "Please select a valid state";
  }

  if (!pincode) {
    errors.pincode = "PIN code is required";
  } else if (!/^[1-9]\d{5}$/.test(pincode)) {
    errors.pincode = "Please enter a valid 6-digit Indian PIN code";
  }

  const firstError = Object.values(errors)[0];
  if (firstError) {
    return { valid: false, error: firstError, errors };
  }

  return {
    valid: true,
    errors: {},
    customer: {
      fullName: fullName.slice(0, 120),
      email: email.slice(0, 120),
      phone,
      address: address.slice(0, 300),
      apartment: apartment.slice(0, 150),
      city: city.slice(0, 80),
      state: state.slice(0, 80),
      pincode,
    },
  };
}

/**
 * Sanitizes URL query reference tokens (order references, payment IDs, error codes)
 * so untrusted query strings cannot inject arbitrary phishing prose into status pages.
 */
export function sanitizeReferenceParam(raw: string | null | undefined, maxLen = 64): string | null {
  if (!raw || typeof raw !== "string") return null;
  const trimmed = raw.trim();
  if (!trimmed || trimmed.length > maxLen) return null;
  if (!/^[A-Za-z0-9_-]+$/.test(trimmed)) return null;
  return trimmed;
}
