# Deployment Guide — Ligero Parfum

This guide covers the recommended hosting architecture for Indian D2C traffic, required environment variables, Vercel (`bom1` Mumbai) production deployment, Sanity & Razorpay live cutover, a fixed-cost Indian VPS self-hosting option, and post-deploy verification.

---

## 1. Recommended Hosting Architecture for India

Because Ligero Parfum runs on **Next.js 15 App Router**, **Sanity CMS** (embedded `/studio` + On-Demand ISR), and **Razorpay** (INR checkout, signature verification, and webhooks), keeping application compute inside India ensures fast API round-trips to Indian payment gateways and UPI apps.

### Option 1 — Vercel (`bom1` Mumbai) + Cloudflare DNS *(Recommended #1)*
This is the most common production setup used by modern Indian D2C brands running Next.js + headless CMS + Razorpay:
- **Zero-config Next.js 15 support**: Native support for App Router Server Components, On-Demand ISR (`revalidateTag` / `revalidatePath` triggered by `/api/revalidate`), and built-in `next/image` optimization for `/images/**` and `https://cdn.sanity.io`.
- **Indian compute region (`bom1`)**: Setting Vercel's Serverless Function Region to **Mumbai (`bom1` / `ap-south-1`)** keeps `/api/razorpay/create-order`, `/api/razorpay/verify`, `/api/razorpay/webhook`, `/api/orders/lookup`, and `/api/reviews` inside India (~15–40 ms latency to Razorpay's Indian servers).
- **Cloudflare DNS**: Managing DNS on Cloudflare (DNS-only / grey cloud recommended alongside Vercel's Edge Network, or SSL **Full (Strict)** if proxied) gives fast DNS propagation across Indian ISPs (Jio, Airtel, ACT), custom email DNS routing, and optional WAF/rate-limiting rules.

### Option 2 — Fixed-Cost Indian VPS (DigitalOcean `blr1` Bangalore / AWS Lightsail `ap-south-1` Mumbai)
Choose this if you want predictable monthly billing (~₹500–₹1,200/month), fixed bandwidth quotas, or full Node.js process control using **Coolify**, **Docker**, or **PM2 + Nginx**:
- Single-server `next start` natively supports On-Demand ISR (`revalidatePath`), `/studio`, and all `/api/*` routes.
- Requires manual OS security updates, Nginx + Certbot TLS setup, and CI/CD (or GitHub Actions) for zero-downtime deploys.

### Option 3 — Enterprise AWS India (`ap-south-1` Mumbai)
For existing AWS-standardized teams: **AWS Amplify Hosting** or **ECS Fargate (`ap-south-1`) + CloudFront + Route 53**. Works well, with higher DevOps and IAM setup overhead than Vercel.

---

## 2. Pre-Deployment Checklist

Run these checks locally before deploying:

1. **Node.js Version**: Ensure Node.js `>= 20` (tested on Node `v22.13.0`).
2. **Type Check**:
   ```bash
   npx tsc --noEmit
   ```
3. **Production Build** (runs `node scripts/build.mjs`, which acquires `.next-build.lock` and executes `next build`):
   ```bash
   npm run build
   ```
4. **Domain Check**: Verify [app/sitemap.ts](app/sitemap.ts) and [app/robots.ts](app/robots.ts) both use `https://ligeroparfums.com`.
5. **Image Domains**: [next.config.ts](next.config.ts) already permits local `/images/**` and remote `https://cdn.sanity.io`.

---

## 3. Environment Variables Reference

Configure these environment variables in your hosting platform (**Production** environment):

| Variable | Visibility | Used By | Notes |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Public | `sanity/env.ts` | Sanity Project ID (`zqurgqiq`). |
| `NEXT_PUBLIC_SANITY_DATASET` | Public | `sanity/env.ts` | Dataset name (`production`). |
| `NEXT_PUBLIC_SANITY_API_VERSION` | Public | `sanity/env.ts` | Defaults to `2024-11-01`. |
| `SANITY_API_WRITE_TOKEN` | **Server-only** | `lib/orders.ts`, `app/api/reviews/route.ts` | **Editor** role token from Sanity Manage. Required to persist orders and customer reviews cleanly. Never prefix with `NEXT_PUBLIC_`. |
| `SANITY_REVALIDATE_SECRET` | **Server-only** | `app/api/revalidate/route.ts` | Random high-entropy string used to validate Sanity On-Demand ISR webhook signatures. |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Public | `app/checkout/page.tsx`, `app/api/razorpay/create-order/route.ts`, `lib/razorpay.ts` | Live Razorpay Key ID (`rzp_live_...`) used by the browser checkout modal. |
| `RAZORPAY_KEY_ID` | **Server-only** | `app/api/razorpay/create-order/route.ts`, `lib/razorpay.ts` | Same live Razorpay Key ID (`rzp_live_...`) for server-side API calls. |
| `RAZORPAY_KEY_SECRET` | **Server-only** | `lib/razorpay.ts` | Live Razorpay Key Secret for order creation and payment signature verification. |
| `RAZORPAY_WEBHOOK_SECRET` | **Server-only** | `lib/razorpay.ts`, `app/api/razorpay/webhook/route.ts` | Secret configured on the Razorpay Webhook dashboard for HMAC verification. |

> **Important**: Any time you change a `NEXT_PUBLIC_*` variable (especially switching `NEXT_PUBLIC_RAZORPAY_KEY_ID` from test to live), you must trigger a **fresh rebuild/redeploy** because Next.js inlines `NEXT_PUBLIC_*` values at build time.

---

## 4. Step-by-Step Deployment on Vercel (Mumbai `bom1`)

1. Push the latest branch to GitHub, GitLab, or Bitbucket.
2. In Vercel, click **Add New → Project** and import the repository.
3. Keep the defaults:
   - **Framework Preset**: `Next.js`
   - **Build Command**: `npm run build`
   - **Install Command**: `npm install` (or `npm ci`)
4. Open **Environment Variables** and add all 9 variables from Section 3 for the **Production** scope.
5. Before or right after the initial deploy, go to **Project Settings → Functions → Function Region** and set the primary region to **Mumbai, India (`bom1` / `ap-south-1`)**.
6. Click **Deploy** (redeploy once if you changed the Function Region or env vars after the first build).

---

## 5. Custom Domain & DNS Setup (`ligeroparfums.com`)

1. In Vercel: **Project Settings → Domains**, add both:
   - `ligeroparfums.com`
   - `www.ligeroparfums.com` (configure redirect to apex or `www` consistently; [app/sitemap.ts](app/sitemap.ts) uses `https://ligeroparfums.com`)
2. In **Cloudflare DNS** (or your registrar — GoDaddy, Namecheap, Hostinger):
   - Add the exact `A` record (`76.76.21.21` or Vercel's project-assigned IP) for `@` (`ligeroparfums.com`) and `CNAME` record (`cname.vercel-dns.com` or project-assigned CNAME) for `www`.
   - **Cloudflare Proxy setting**: Use **DNS only (grey cloud)** so Vercel handles edge TLS directly without certificate renewal conflicts or webhook body buffering. If you enable Cloudflare proxy (orange cloud), set Cloudflare SSL/TLS mode to **Full (Strict)**.
3. Wait for SSL certificates in Vercel Domains to show **Valid Configuration**.

---

## 6. Sanity Production Configuration *(Critical Post-Deploy Steps)*

### A. Allow Live Domain in Sanity CORS Origins
Without this step, logging into `https://ligeroparfums.com/studio` will fail with CORS errors:
1. Open: `https://www.sanity.io/manage/project/zqurgqiq/api#cors-origins`
2. Click **Add CORS origin** and add:
   - `https://ligeroparfums.com` — **Check "Allow credentials"**
   - `https://www.ligeroparfums.com` — **Check "Allow credentials"**
3. Keep `http://localhost:3000` with **Allow credentials** checked if local studio edits are still needed.

### B. Register On-Demand ISR Webhook
Register the Sanity document webhook so publishing edits in `/studio` immediately refreshes live pages via [app/api/revalidate/route.ts](app/api/revalidate/route.ts):

1. Ensure `SANITY_API_WRITE_TOKEN` and `SANITY_REVALIDATE_SECRET` in your local `.env.local` match the production values you configured in hosting.
2. Run [scripts/setup-webhook.mjs](scripts/setup-webhook.mjs):
   ```bash
   node --env-file=.env.local scripts/setup-webhook.mjs https://ligeroparfums.com
   ```
   (Or `npm run sanity:webhook -- https://ligeroparfums.com`)
3. Verify registered webhooks:
   ```bash
   node --env-file=.env.local scripts/setup-webhook.mjs --list
   ```
   Confirm the active webhook points to `https://ligeroparfums.com/api/revalidate` on dataset `production`. Remove any stale ngrok/local webhook IDs with `--delete <webhook-id>`.

### C. Initial Data Migration *(Only for a Fresh/Empty Dataset)*
If deploying to a brand-new Sanity dataset that has not been seeded yet, populate the 7 perfumes, house objects, and homepage/settings singletons using [scripts/migrate-to-sanity.ts](scripts/migrate-to-sanity.ts):
```bash
npm run sanity:migrate
```

---

## 7. Razorpay Live Mode Cutover

1. Log in to the **Razorpay Dashboard** and ensure business KYC is approved and **Live Mode** is active.
2. Go to **Account & Settings → API Keys** (in **Live Mode**) and generate a new `rzp_live_...` Key ID and Key Secret.
3. Update these hosting environment variables to the live credentials:
   - `NEXT_PUBLIC_RAZORPAY_KEY_ID`
   - `RAZORPAY_KEY_ID`
   - `RAZORPAY_KEY_SECRET`
4. Go to **Account & Settings → Webhooks** (in **Live Mode**) → **Add New Webhook**:
   - **Webhook URL**: `https://ligeroparfums.com/api/razorpay/webhook`
   - **Secret**: Generate a strong secret and save the exact same value as `RAZORPAY_WEBHOOK_SECRET` in your hosting environment variables.
   - **Active Events** (handled by [app/api/razorpay/webhook/route.ts](app/api/razorpay/webhook/route.ts)):
     - `payment.captured`
     - `order.paid`
     - `payment.failed`
5. Trigger a **production redeploy** so `NEXT_PUBLIC_RAZORPAY_KEY_ID` is baked into the client bundle and the webhook secret is active on the server.

---

## 8. Self-Hosting Alternative (DigitalOcean `blr1` / AWS `ap-south-1` VPS with PM2 + Nginx)

If hosting on an Ubuntu 22.04/24.04 VPS in **Bangalore (`blr1`)** or **Mumbai (`ap-south-1`)**:

1. **Install runtime & tools**:
   - Install Node.js 22 LTS, `pm2` (`npm install -g pm2`), `nginx`, and `certbot` (`python3-certbot-nginx`).
2. **Clone & build**:
   ```bash
   git clone <your-repo-url> /var/www/ligero
   cd /var/www/ligero
   npm ci
   ```
   Create `/var/www/ligero/.env.local` (or pass via environment) containing all 9 production variables from Section 3, then build:
   ```bash
   npm run build
   ```
3. **Run with PM2**:
   ```bash
   pm2 start npm --name "ligero" -- start
   pm2 save
   pm2 startup
   ```
   (`next start` listens on `http://127.0.0.1:3000` by default.)
4. **Nginx reverse proxy & HTTPS**:
   Configure Nginx to `proxy_pass http://127.0.0.1:3000` for `ligeroparfums.com` and `www.ligeroparfums.com` (preserve `Host`, `X-Forwarded-For`, `X-Forwarded-Proto` headers, and allow standard request bodies for Razorpay/Sanity webhooks), then issue TLS certificates:
   ```bash
   sudo certbot --nginx -d ligeroparfums.com -d www.ligeroparfums.com
   ```
5. Complete **Sections 6 and 7** (Sanity CORS, ISR webhook, Razorpay Live keys + webhook).

---

## 9. Post-Deployment Verification Checklist

- [ ] **Storefront pages render cleanly**: Check `/`, `/collection`, `/collection/aube`, `/discovery-set`, `/objects`, `/objects/en-route`, `/help`, and `/legal/*` (`privacy`, `terms`, `shipping-returns`, `compliance-checklist`).
- [ ] **Studio loads & authenticates**: Open `https://ligeroparfums.com/studio`, sign in with Sanity credentials, and verify documents load with zero CORS errors in DevTools Console.
- [ ] **On-Demand ISR works**: Make a minor subtitle/copy edit on a product in `/studio`, click **Publish**, hard-refresh that page on `https://ligeroparfums.com`, and verify the update appears cleanly.
- [ ] **Razorpay Live Checkout & Webhook end-to-end**: Place a low-value live order or UPI test transaction on `/checkout`, verify redirect to `/checkout/success` (which queries `/api/orders/lookup`), confirm the order status updates to Paid in Sanity Studio (`Order` documents), and inspect Razorpay Webhook logs for HTTP `200`.
- [ ] **SEO endpoints**: Verify `https://ligeroparfums.com/sitemap.xml` and `https://ligeroparfums.com/robots.txt` return HTTP `200`.
