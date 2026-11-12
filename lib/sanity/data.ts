import { sanityFetch } from '@/sanity/lib/client'
import {
  PERFUMES_QUERY,
  PERFUME_BY_SLUG_QUERY,
  OBJECTS_QUERY,
  HOMEPAGE_QUERY,
  SITE_SETTINGS_QUERY,
  APPROVED_REVIEWS_QUERY,
} from '@/sanity/lib/queries'
import { PERFUMES, OBJECTS, type Product, type HouseObject } from '@/lib/products'
import { type PublicReview, REAL_APPROVED_REVIEWS } from '@/lib/reviews'

/**
 * Fetches all perfumes from Sanity with automatic fallback to static catalog
 */
export async function getLivePerfumes(): Promise<Product[]> {
  try {
    const data = await sanityFetch<Product[]>({
      query: PERFUMES_QUERY,
      tags: ['perfume'],
    })
    if (data && Array.isArray(data) && data.length > 0) {
      return data
    }
  } catch (error) {
    console.warn('[Sanity] Fetch failed, using static PERFUMES catalog:', error)
  }
  return PERFUMES
}

/**
 * Fetches a single perfume by slug with automatic fallback to static catalog
 */
export async function getLivePerfumeBySlug(slug: string): Promise<Product | undefined> {
  try {
    const data = await sanityFetch<Product>({
      query: PERFUME_BY_SLUG_QUERY,
      params: { slug },
      tags: ['perfume', `perfume:${slug}`],
    })
    if (data && data.slug) {
      return data
    }
  } catch (error) {
    console.warn(`[Sanity] Fetch failed for ${slug}, using static fallback:`, error)
  }
  return PERFUMES.find((p) => p.slug === slug)
}

/**
 * Fetches house objects (Discovery set, En route) with fallback
 */
export async function getLiveObjects(): Promise<HouseObject[]> {
  try {
    const data = await sanityFetch<HouseObject[]>({
      query: OBJECTS_QUERY,
      tags: ['houseObject'],
    })
    if (data && Array.isArray(data) && data.length > 0) {
      return data
    }
  } catch (error) {
    console.warn('[Sanity] Fetch failed, using static OBJECTS catalog:', error)
  }
  return OBJECTS
}

export interface HomepageData {
  heroEyebrow?: string
  heroHeading?: string
  heroHeadingItalic?: string
  heroCtaText?: string
  heroCtaLink?: string
  heroImage?: string
  featuredBadge?: string
  featuredTitle?: string
  featuredSubtitle?: string
  featuredDescription?: string
  featuredProductSlug?: string
  featuredBannerImage?: string
  featuredBottleCutout?: string
  objectsEyebrow?: string
  objectsHeading?: string
  objectsDescription?: string
  patronsEyebrow?: string
  patronsHeading?: string
  patronsDescription?: string
  patronsPromise?: string
}

/**
 * Fetches Homepage editorial content from Sanity
 */
export async function getLiveHomepage(): Promise<HomepageData | null> {
  try {
    const data = await sanityFetch<HomepageData>({
      query: HOMEPAGE_QUERY,
      tags: ['homePage'],
    })
    return data || null
  } catch (error) {
    console.warn('[Sanity] Fetch failed for homepage content:', error)
    return null
  }
}

export interface SiteSettingsData {
  brandName?: string
  tagline?: string
  conciergeEmail?: string
  legalEntityName?: string
  gstin?: string
  registeredAddress?: string
  grievanceOfficerName?: string
  footerCopyright?: string
}

/**
 * Fetches global site settings from Sanity
 */
export async function getLiveSiteSettings(): Promise<SiteSettingsData | null> {
  try {
    const data = await sanityFetch<SiteSettingsData>({
      query: SITE_SETTINGS_QUERY,
      tags: ['siteSettings'],
    })
    return data || null
  } catch (error) {
    console.warn('[Sanity] Fetch failed for site settings:', error)
    return null
  }
}

/**
 * Fetches approved reviews for one perfume. Returns an empty list when Sanity
 * is unreachable or no review has been approved, never placeholder data.
 */
export async function getApprovedReviews(slug: string): Promise<PublicReview[]> {
  try {
    const data = await sanityFetch<PublicReview[]>({
      query: APPROVED_REVIEWS_QUERY,
      params: { slug },
      tags: ['customerReview', `review:${slug}`],
    })
    if (Array.isArray(data) && data.length > 0) {
      return data
    }
  } catch (error) {
    console.warn(`[Sanity] Fetch failed for reviews of ${slug}:`, error)
  }
  return REAL_APPROVED_REVIEWS[slug] ?? []
}
