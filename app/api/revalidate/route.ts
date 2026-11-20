import { revalidateTag, revalidatePath } from "next/cache";
import { type NextRequest } from "next/server";
import { parseBody } from "next-sanity/webhook";
import { isValidSlug, secureJson } from "@/lib/security";

export const runtime = "nodejs";

const ALLOWED_TYPES = new Set([
  "perfume",
  "customerReview",
  "homePage",
  "siteSettings",
  "legalPage",
  "houseObject",
]);

const MAX_WEBHOOK_BYTES = 64 * 1024;

export async function POST(req: NextRequest) {
  try {
    const contentLength = Number(req.headers.get("content-length") || "0");
    if (Number.isFinite(contentLength) && contentLength > MAX_WEBHOOK_BYTES) {
      return secureJson(
        { ok: false, error: "Payload exceeds maximum allowed size." },
        413
      );
    }

    const secret = (process.env.SANITY_REVALIDATE_SECRET || "").trim();
    if (!secret) {
      console.error("[Revalidate] SANITY_REVALIDATE_SECRET is not configured; rejecting request.");
      return secureJson(
        { ok: false, error: "Revalidation webhook is not authorized." },
        401
      );
    }

    const { isValidSignature, body } = await parseBody<{
      _type?: string;
      slug?: string | { current?: string };
      perfumeSlug?: string;
    }>(req, secret);

    if (isValidSignature !== true) {
      return secureJson({ ok: false, error: "Invalid signature." }, 401);
    }

    if (!body || typeof body._type !== "string" || !ALLOWED_TYPES.has(body._type)) {
      return secureJson({ ok: false, error: "Unsupported document type." }, 400);
    }

    const type = body._type;
    const rawSlug =
      typeof body.slug === "string" ? body.slug : body.slug?.current;
    const slugValue = isValidSlug(rawSlug) ? rawSlug : undefined;
    const reviewSlug = isValidSlug(body.perfumeSlug) ? body.perfumeSlug : undefined;

    revalidateTag(type);

    if (type === "perfume") {
      revalidateTag("perfume");
      revalidatePath("/");
      revalidatePath("/collection");
      revalidatePath("/collection/[slug]", "page");
      revalidatePath("/discovery-set");
      revalidatePath("/sitemap.xml");
      revalidatePath("/llms.txt");
      revalidatePath("/llms-full.txt");
      revalidatePath("/pricing.md");
      revalidatePath("/", "layout");
      if (slugValue) {
        revalidateTag(`perfume:${slugValue}`);
        revalidatePath(`/collection/${slugValue}`);
      }
    } else if (type === "customerReview") {
      revalidateTag("customerReview");
      if (reviewSlug) {
        revalidateTag(`review:${reviewSlug}`);
        if (reviewSlug === "en-route") {
          revalidatePath("/objects/en-route");
        } else if (reviewSlug === "discovery-set") {
          revalidatePath("/discovery-set");
        } else {
          revalidatePath(`/collection/${reviewSlug}`);
        }
      }
    } else if (type === "homePage") {
      revalidateTag("homePage");
      revalidatePath("/");
    } else if (type === "siteSettings") {
      revalidateTag("siteSettings");
      revalidatePath("/", "layout");
    } else if (type === "legalPage") {
      revalidateTag("legalPage");
      revalidatePath("/legal", "layout");
    } else if (type === "houseObject") {
      revalidateTag("houseObject");
      revalidatePath("/");
      revalidatePath("/collection");
      revalidatePath("/objects");
      revalidatePath("/objects/en-route");
      revalidatePath("/discovery-set");
      revalidatePath("/sitemap.xml");
      revalidatePath("/llms.txt");
      revalidatePath("/llms-full.txt");
      revalidatePath("/pricing.md");
      revalidatePath("/", "layout");
    }

    return secureJson({
      status: 200,
      revalidated: true,
      now: Date.now(),
      type,
    });
  } catch (err) {
    console.error("[Revalidate Error]:", err);
    return secureJson({ ok: false, error: "Revalidation failed." }, 500);
  }
}
