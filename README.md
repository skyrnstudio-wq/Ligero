# Ligero Parfum

E-commerce storefront and editorial showcase for **Ligero Parfum** — an independent perfume house based in India offering permanent eau de parfum creations, the Discovery Set, and house objects.

Built with **Next.js 15 (App Router)**, **React 19**, **Tailwind CSS v4**, **Sanity CMS** (embedded Studio + On-Demand ISR), **Razorpay**, **Resend**, and **Playwright**.

---

## Tech Stack

- **Framework:** Next.js 15 (App Router), React 19, TypeScript
- **Styling & Motion:** Tailwind CSS v4, Motion (`motion`), Lenis (`lenis`)
- **CMS:** Sanity v3 (`sanity`, `next-sanity`, `@sanity/client`, `@sanity/image-url`, `@sanity/vision`) mounted at `/studio`
- **Payments:** Razorpay (`razorpay`) with server-side signature and webhook HMAC verification
- **Email:** Resend transactional emails (`lib/email.ts`) for order confirmation, dispatch, and Correspondence notifications
- **Testing:** Playwright (`@playwright/test`) across 6 responsive viewport profiles

---

## Prerequisites

- **Node.js** `>= 20`
- **npm**
- A **Sanity** project (`production` dataset) with an Editor-role API token
- **Razorpay** API credentials (test or live mode) and webhook secret
- **Resend** API key and verified sender domain (for transactional emails)

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

> `postinstall` automatically runs `node scripts/build.mjs --patch-only` to patch `@next/font/google` for extensionless Google Font URLs.

### 2. Configure environment variables

Copy `.env.example` to `.env.local` and fill in your credentials:

```bash
cp .env.example .env.local
```

| Variable | Visibility | Description |
| --- | --- | --- |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Public | Sanity project ID |
| `NEXT_PUBLIC_SANITY_DATASET` | Public | Sanity dataset name (defaults to `production`) |
| `NEXT_PUBLIC_SANITY_API_VERSION` | Public | Optional Sanity API version (defaults to `2024-11-01`) |
| `SANITY_API_WRITE_TOKEN` | Server-only | Sanity Editor token for persisting orders, reviews, and running scripts |
| `SANITY_REVALIDATE_SECRET` | Server-only | Secret for authenticating `/api/revalidate` webhooks |
| `SANITY_ORDER_WEBHOOK_SECRET` | Server-only | Optional secret for `/api/orders/dispatch-webhook` (defaults to `SANITY_REVALIDATE_SECRET`) |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Public | Razorpay Key ID (`rzp_test_...` or `rzp_live_...`) for browser checkout |
| `RAZORPAY_KEY_ID` | Server-only | Razorpay Key ID for server API calls |
| `RAZORPAY_KEY_SECRET` | Server-only | Razorpay Key Secret for order creation and signature verification |
| `RAZORPAY_WEBHOOK_SECRET` | Server-only | Secret configured in Razorpay Webhooks for HMAC verification |
| `RESEND_API_KEY` | Server-only | Resend API key (`re_...`) for order, dispatch, and Correspondence emails |
| `RESEND_FROM_EMAIL` | Server-only | Verified sender address (e.g. `Ligero Parfum <sales@ligeroparfum.com>`) |
| `ORDER_NOTIFICATION_EMAIL` | Server-only | Optional atelier alert inbox (defaults to `sales@ligeroparfum.com`; set to `off` to disable) |
| `CORRESPONDENCE_NOTIFICATION_EMAIL` | Server-only | Optional inbox for "The Correspondence" submission alerts (defaults to `ORDER_NOTIFICATION_EMAIL` / `sales@ligeroparfum.com`; set to `off` to disable) |

> **Note:** Changing any `NEXT_PUBLIC_*` variable requires a fresh production build because Next.js inlines public variables at build time.

### 3. Seed Sanity (optional, for a fresh dataset)

Populate perfumes, house objects, and singletons from `lib/products.ts` into Sanity:

```bash
npm run sanity:migrate
```

### 4. Run the development server

```bash
npm run dev
```

- Storefront: `http://localhost:3000`
- Sanity Studio: `http://localhost:3000/studio`

*(Development builds output to `.next-dev` while production builds output to `.next`.)*

---

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Next.js development server |
| `npm run build` | Run `scripts/build.mjs` (patches font loader, acquires `.next-build.lock`, runs `next build`) |
| `npm run start` | Start the production server |
| `npm run test:e2e` | Run the full Playwright E2E test suite |
| `npm run test:e2e:smoke` | Run route smoke tests (`tests/e2e/routes-smoke.spec.ts`) |
| `npm run test:e2e:tier1` | Run Tier 1 feature tests |
| `npm run test:e2e:tier2` | Run Tier 2 boundary tests |
| `npm run test:e2e:tier3` | Run Tier 3 combination tests |
| `npm run test:e2e:tier4` | Run Tier 4 end-to-end scenario tests |
| `npm run sanity:migrate` | Seed Sanity dataset via `scripts/migrate-to-sanity.ts` |
| `npm run sanity:webhook` | Manage Sanity ISR and order dispatch webhooks via `scripts/setup-webhook.mjs` |

---

## Project Structure

```text
app/
  api/
    correspondence/       # Stores "The Correspondence" subscriptions and notifies sales@ligeroparfum.com
    orders/
      dispatch-webhook/   # Sanity webhook for order dispatch emails
      lookup/             # Order status lookup for checkout confirmation
    razorpay/
      create-order/       # Creates Razorpay order
      verify/             # Verifies payment signature & persists order
      webhook/            # Handles Razorpay payment/order/refund webhooks
    revalidate/           # On-Demand ISR endpoint for Sanity content updates
    reviews/              # Customer review submission & retrieval
  checkout/               # Checkout flow, success, and failure pages
  collection/             # Fragrance catalog & individual [slug] pages
  discovery-set/          # Discovery Set landing & purchase page
  help/                   # Help & client concierge page
  legal/                  # Privacy, terms, shipping & returns, compliance checklist
  objects/                # House objects & En Route page
  studio/                 # Embedded Sanity Studio (/studio)
  llms.txt/               # LLM-readable site index
  llms-full.txt/          # Extended LLM-readable catalog & house guide
  pricing.md/             # Markdown pricing endpoint
  robots.ts               # Robots rules (including AI crawler rules)
  sitemap.ts              # Dynamic XML sitemap
components/               # Storefront UI, drawers, product architecture & modals
context/                  # Case (cart) and catalog React contexts
lib/                      # Product data, Sanity fetchers, Razorpay, orders & email helpers
public/images/            # Static WebP assets (hero, perfumes, objects, brand, textures)
sanity/
  components/             # Studio error boundary & resilient Vision tool
  lib/                    # Sanity client, GROQ queries, image URL builder
  schemaTypes/            # Singletons, document schemas, and object types
scripts/                  # Build wrapper, Sanity migration, and webhook CLI
tests/                    # Playwright E2E specs and responsive viewport helpers
```

---

## Sanity CMS & Webhooks

### Content Schema (`sanity/schemaTypes/`)

- **Singletons:** `siteSettings`, `homePage`
- **Documents:** `perfume`, `houseObject`, `customerReview`, `legalPage`, `order` (kept under `drafts.order-*` in Studio), `correspondenceSubscriber` (kept under `drafts.correspondence-*` in Studio)
- **Objects:** `scentProfile`, `keyIngredient`

### CORS & Webhooks

1. **Sanity CORS Origins:** Add your local (`http://localhost:3000`) and production origins (with **Allow credentials** enabled) in the Sanity Project API settings so `/studio` can authenticate.
2. **Provision Webhooks** using `scripts/setup-webhook.mjs`:

```bash
# List existing webhooks
node --env-file=.env.local scripts/setup-webhook.mjs --list

# Register On-Demand ISR webhook -> <url>/api/revalidate
node --env-file=.env.local scripts/setup-webhook.mjs https://www.ligeroparfum.com

# Register Order Dispatch Email webhook -> <url>/api/orders/dispatch-webhook
node --env-file=.env.local scripts/setup-webhook.mjs --orders https://www.ligeroparfum.com

# Delete a webhook by ID
node --env-file=.env.local scripts/setup-webhook.mjs --delete <webhook-id>
```

---

## Testing

Playwright (`playwright.config.ts`) builds/reuses `npm run start` on `http://localhost:3000` (configurable via `PLAYWRIGHT_TEST_BASE_URL`) and executes tests across six viewport projects: `mobile-se` (375×667), `mobile-std` (390×844), `tablet-portrait` (768×1024), `tablet-air` (820×1180), `laptop` (1024×768), and `desktop` (1440×900).

```bash
npx tsc --noEmit
npm run build
npm run test:e2e
```

---

## Deployment Notes

- **Region:** When deploying to Vercel or a cloud host for Indian D2C traffic, prefer an Indian region such as Mumbai (`bom1` / `ap-south-1`) or Bangalore (`blr1`) for low-latency Razorpay API round-trips.
- **Image Domains:** `next.config.ts` permits local `/images/**` assets and remote `https://cdn.sanity.io` images.
- **Legacy Redirects:** `/products` and `/products/:slug` permanently redirect to `/collection` and `/collection/:slug`.
- **Razorpay Live Cutover:** Update `NEXT_PUBLIC_RAZORPAY_KEY_ID`, `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, and `RAZORPAY_WEBHOOK_SECRET` to live keys, register `https://<your-domain>/api/razorpay/webhook` for `payment.captured`, `order.paid`, `payment.failed`, and `refund.processed`, and trigger a full redeploy.
