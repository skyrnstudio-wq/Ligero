import { test, expect } from "@playwright/test";
import crypto from "crypto";
import fs from "fs";
import path from "path";

function readLocalEnvVar(key: string): string {
  if (process.env[key]) return process.env[key]!.trim();
  const envPath = path.resolve(process.cwd(), ".env.local");
  if (!fs.existsSync(envPath)) return "";
  for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m && m[1] === key) {
      return m[2].trim().replace(/^["']|["']$/g, "");
    }
  }
  return "";
}

const VALID_CUSTOMER = {
  fullName: "Radhika Sharma",
  email: "radhika@example.com",
  phone: "+91 98765 43210",
  address: "14 Marine Drive, Heritage Residency",
  apartment: "Suite 402",
  city: "Mumbai",
  state: "Maharashtra",
  pincode: "400001",
};

test.describe("Payment Security & Edge Cases", () => {
  test("create-order rejects malformed JSON, non-objects, invalid quantities, and duplicate-slug overflow", async ({
    request,
  }) => {
    const malformed = await request.post("/api/razorpay/create-order", {
      headers: { "content-type": "application/json" },
      data: "{not-valid-json",
    });
    expect(malformed.status()).toBe(400);
    expect(malformed.headers()["cache-control"]).toContain("no-store");

    const arrayBody = await request.post("/api/razorpay/create-order", {
      data: [],
    });
    expect(arrayBody.status()).toBe(400);

    const overflowDup = await request.post("/api/razorpay/create-order", {
      data: {
        items: [
          { slug: "aube", quantity: 30 },
          { slug: "aube", quantity: 25 },
        ],
        customer: VALID_CUSTOMER,
      },
    });
    expect(overflowDup.status()).toBe(400);

    const unknownSlug = await request.post("/api/razorpay/create-order", {
      data: {
        items: [{ slug: "non-existent-perfume", quantity: 1 }],
        customer: VALID_CUSTOMER,
      },
    });
    expect(unknownSlug.status()).toBe(400);
  });

  test("create-order enforces server-side customer & Indian shipping validation", async ({
    request,
  }) => {
    const missingCustomer = await request.post("/api/razorpay/create-order", {
      data: {
        items: [{ slug: "aube", quantity: 1 }],
      },
    });
    expect(missingCustomer.status()).toBe(400);
    const missingBody = await missingCustomer.json();
    expect(missingBody.fieldErrors).toBeTruthy();

    const invalidPin = await request.post("/api/razorpay/create-order", {
      data: {
        items: [{ slug: "aube", quantity: 1 }],
        customer: { ...VALID_CUSTOMER, pincode: "000001" },
      },
    });
    expect(invalidPin.status()).toBe(400);
    const pinBody = await invalidPin.json();
    expect(pinBody.fieldErrors?.pincode).toBeTruthy();
  });

  test("create-order detects stale client prices and returns 409 with live catalog items", async ({
    request,
  }) => {
    const res = await request.post("/api/razorpay/create-order", {
      data: {
        items: [{ slug: "aube", quantity: 1, price: 1 }],
        customer: VALID_CUSTOMER,
        expectedAmountPaise: 100,
      },
    });
    expect(res.status()).toBe(409);
    expect(res.headers()["cache-control"]).toContain("no-store");

    const data = await res.json();
    expect(data.priceChanged).toBe(true);
    expect(data.amountPaise).toBeGreaterThan(100);
    expect(Array.isArray(data.items)).toBe(true);
    expect(data.items[0]?.slug).toBe("aube");
  });

  test("verify rejects malformed JSON, non-string payloads, bad ID formats, and forged signatures", async ({
    request,
  }) => {
    const malformed = await request.post("/api/razorpay/verify", {
      headers: { "content-type": "application/json" },
      data: "{broken",
    });
    expect(malformed.status()).toBe(400);
    expect(malformed.headers()["cache-control"]).toContain("no-store");

    const nonString = await request.post("/api/razorpay/verify", {
      data: {
        razorpay_order_id: ["order_1234567890AB"],
        razorpay_payment_id: ["pay_1234567890AB"],
        razorpay_signature: ["a".repeat(64)],
      },
    });
    expect(nonString.status()).toBe(400);

    const forged = await request.post("/api/razorpay/verify", {
      data: {
        razorpay_order_id: "order_1234567890AB",
        razorpay_payment_id: "pay_1234567890AB",
        razorpay_signature: "a".repeat(64),
      },
    });
    expect(forged.status()).toBe(400);
    const forgedBody = await forged.json();
    expect(forgedBody.verified).toBe(false);
  });

  test("webhook enforces HMAC signature, handles malformed JSON, ignores untracked external events, and rejects non-INR", async ({
    request,
  }) => {
    const webhookSecret = readLocalEnvVar("RAZORPAY_WEBHOOK_SECRET");

    const forged = await request.post("/api/razorpay/webhook", {
      headers: {
        "content-type": "application/json",
        "x-razorpay-signature": "0".repeat(64),
      },
      data: JSON.stringify({ event: "payment.captured" }),
    });
    expect([400, 503]).toContain(forged.status());
    expect(forged.headers()["cache-control"]).toContain("no-store");

    if (!webhookSecret) return;

    const sign = (raw: string) =>
      crypto.createHmac("sha256", webhookSecret).update(raw).digest("hex");

    const malformedRaw = "{invalid_json";
    const malformedRes = await request.post("/api/razorpay/webhook", {
      headers: {
        "content-type": "application/json",
        "x-razorpay-signature": sign(malformedRaw),
      },
      data: malformedRaw,
    });
    expect(malformedRes.status()).toBe(400);

    // Untracked external payment on same merchant account should return 200 ignored (never pollute Sanity or 500)
    const externalCaptured = JSON.stringify({
      event: "payment.captured",
      payload: {
        payment: {
          entity: {
            id: "pay_EXTERNAL999999",
            order_id: "order_EXTERNAL999999",
            amount: 50000,
            currency: "INR",
            status: "captured",
            notes: {},
          },
        },
      },
    });
    const extCapRes = await request.post("/api/razorpay/webhook", {
      headers: {
        "content-type": "application/json",
        "x-razorpay-signature": sign(externalCaptured),
      },
      data: externalCaptured,
    });
    expect(extCapRes.status()).toBe(200);
    const extCapBody = await extCapRes.json();
    expect(extCapBody.ignored).toBe(true);

    // Untracked external refund should return 200 ignored (never cause 500 webhook retry disablement)
    const externalRefund = JSON.stringify({
      event: "refund.processed",
      payload: {
        refund: {
          entity: {
            id: "rfnd_EXTERNAL999999",
            payment_id: "pay_EXTERNAL999999",
            amount: 50000,
            currency: "INR",
            status: "processed",
          },
        },
      },
    });
    const extRefRes = await request.post("/api/razorpay/webhook", {
      headers: {
        "content-type": "application/json",
        "x-razorpay-signature": sign(externalRefund),
      },
      data: externalRefund,
    });
    expect(extRefRes.status()).toBe(200);
    const extRefBody = await extRefRes.json();
    expect(extRefBody.ignored).toBe(true);

    // Non-INR payment event must be rejected with 400
    const nonInr = JSON.stringify({
      event: "payment.captured",
      payload: {
        payment: {
          entity: {
            id: "pay_USDTEST123456",
            order_id: "order_USDTEST123456",
            amount: 5000,
            currency: "USD",
            status: "captured",
            notes: { orderReference: "LGP-TEST-999" },
          },
        },
      },
    });
    const nonInrRes = await request.post("/api/razorpay/webhook", {
      headers: {
        "content-type": "application/json",
        "x-razorpay-signature": sign(nonInr),
      },
      data: nonInr,
    });
    expect(nonInrRes.status()).toBe(400);
  });

  test("orders lookup enforces no-store caching and rejects missing/forged tokens", async ({
    request,
  }) => {
    const missing = await request.get("/api/orders/lookup");
    expect(missing.status()).toBe(400);
    expect(missing.headers()["cache-control"]).toContain("no-store");

    const forged = await request.get(
      "/api/orders/lookup?orderId=LGP-TEST-100&paymentId=pay_TEST12345678&token=forged"
    );
    expect(forged.status()).toBe(401);
    expect(forged.headers()["cache-control"]).toContain("no-store");
  });

  test("/checkout/success never shows fake confirmed order on direct unverified visit and sets security headers", async ({
    page,
  }) => {
    const res = await page.goto("/checkout/success?orderId=LGP-SPOOF-999", {
      waitUntil: "networkidle",
    });
    expect(res?.status()).toBe(200);
    expect(res?.headers()["referrer-policy"]).toBe("no-referrer");
    expect(res?.headers()["cache-control"]).toContain("no-store");

    const bodyText = await page.locator("main").innerText();
    expect(bodyText).not.toContain("LGP-2026-9481");
    expect(bodyText).not.toContain("LGP-SPOOF-999");
    expect(bodyText).not.toContain("Payment Confirmed");
    expect(bodyText).toContain("No verified order found");
  });

  test("/checkout/failed blocks reflected ?reason= spoofing and renders VERIFICATION_PENDING guidance safely", async ({
    page,
  }) => {
    await page.goto(
      "/checkout/failed?reason=Send+money+to+scammer@upi&orderId=LGP-BAD<script>",
      { waitUntil: "domcontentloaded" }
    );
    const spoofText = await page.locator("main").innerText();
    expect(spoofText).not.toContain("scammer@upi");
    expect(spoofText).not.toContain("LGP-BAD");

    await page.goto(
      "/checkout/failed?code=VERIFICATION_PENDING&orderId=LGP-VERIFY-101&paymentId=pay_TESTVERIFY1234",
      { waitUntil: "domcontentloaded" }
    );
    const pendingText = await page.locator("main").innerText();
    expect(pendingText).toMatch(/verification in progress/i);
    expect(pendingText).toMatch(/do not double-pay/i);
    expect(pendingText).toContain("LGP-VERIFY-101");
    expect(pendingText).toContain("pay_TESTVERIFY1234");
  });
});
