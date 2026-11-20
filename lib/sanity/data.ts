import { cache } from 'react'
import { createClient } from '@sanity/client'
import { sanityFetch } from '@/sanity/lib/client'
import { apiVersion, dataset, projectId } from '@/sanity/env'
import {
  PERFUMES_QUERY,
  PERFUME_BY_SLUG_QUERY,
  OBJECTS_QUERY,
  OBJECT_BY_SLUG_QUERY,
  HOMEPAGE_QUERY,
  SITE_SETTINGS_QUERY,
  APPROVED_REVIEWS_QUERY,
} from '@/sanity/lib/queries'
import {
  PERFUMES,
  OBJECTS,
  type Product,
  type HouseObject,
  type SeoMetadata,
} from '@/lib/products'
import { type PublicReview, REAL_APPROVED_REVIEWS } from '@/lib/reviews'

function optimizeSanityImageUrl(url: string | undefined, maxWidth = 1440): string | undefined {
  if (!url) return url
  if (url.startsWith('https://cdn.sanity.io/images/') && !url.includes('?')) {
    return `${url}?fm=webp&fit=max&w=${maxWidth}&q=80`
  }
  return url
}

function normalizeSeo(seo?: SeoMetadata | null): SeoMetadata | undefined {
  if (!seo) return undefined
  const title = typeof seo.title === 'string' && seo.title.trim() ? seo.title.trim() : undefined
  const description =
    typeof seo.description === 'string' && seo.description.trim()
      ? seo.description.trim()
      : undefined
  const image =
    typeof seo.image === 'string' && seo.image.trim()
      ? optimizeSanityImageUrl(seo.image.trim(), 1200)
      : undefined
  const noIndex = seo.noIndex === true ? true : undefined

  if (!title && !description && !image && !noIndex) return undefined
  return { title, description, image, noIndex }
}

function sanitizeExtraitText(val?: string): string | undefined {
  if (!val) return val
  return val
    .replace(/Extrait de Parfum/gi, 'Eau de Parfum')
    .replace(/botanical extraits/gi, 'botanical extracts')
}

function sanitizePerfumeBadge(badge?: string): string | undefined {
  if (!badge || /extrait/i.test(badge)) return undefined
  return badge
}

function sanitizeObjectBadge(badge?: string): string | undefined {
  if (!badge || /redeemable/i.test(badge)) return undefined
  return badge
}

function normalizePerfume(item: Partial<Product>, staticItem?: Product): Product {
  const mergedKeyIngredients =
    item.keyIngredients?.map((ing, idx) => ({
      ...ing,
      image: optimizeSanityImageUrl(ing.image || staticItem?.keyIngredients?.[idx]?.image, 900),
    })) ||
    staticItem?.keyIngredients ||
    []

  const rawPoem = Array.isArray(item.notesPoem) ? item.notesPoem : []
  const notesPoem: [string, string, string] = [
    rawPoem[0] ?? staticItem?.notesPoem?.[0] ?? '',
    rawPoem[1] ?? staticItem?.notesPoem?.[1] ?? '',
    rawPoem[2] ?? staticItem?.notesPoem?.[2] ?? '',
  ]

  const optimizedGallery =
    item.gallery && item.gallery.length > 0
      ? item.gallery.map((g) => optimizeSanityImageUrl(g, 1440) || g)
      : staticItem?.gallery || []

  const rawBadge = sanitizePerfumeBadge(item.badge) ?? sanitizePerfumeBadge(staticItem?.badge)

  return {
    slug: item.slug || staticItem?.slug || '',
    updatedAt: item.updatedAt,
    seo: normalizeSeo(item.seo),
    name: item.name || staticItem?.name || '',
    subtitle: item.subtitle || staticItem?.subtitle || '',
    volume:
      sanitizeExtraitText(item.volume) ||
      sanitizeExtraitText(staticItem?.volume) ||
      '50 ml · Eau de Parfum',
    price: typeof item.price === 'number' ? item.price : staticItem?.price ?? 0,
    badge: rawBadge,
    oneLiner: item.oneLiner || staticItem?.oneLiner || '',
    notesUppercase: item.notesUppercase || staticItem?.notesUppercase || '',
    notesPoem,
    ritual: item.ritual || staticItem?.ritual || '',
    material: item.material || staticItem?.material || '',
    provenance:
      sanitizeExtraitText(item.provenance) ||
      sanitizeExtraitText(staticItem?.provenance) ||
      '',
    image:
      optimizeSanityImageUrl(item.image, 1000) ||
      staticItem?.image ||
      `/images/perfumes/cutouts/${item.slug || staticItem?.slug || 'aube'}.webp?v=2`,
    notesImage: optimizeSanityImageUrl(item.notesImage, 1000) || staticItem?.notesImage,
    gallery: optimizedGallery,
    relatedSlugs: item.relatedSlugs && item.relatedSlugs.length > 0 ? item.relatedSlugs : staticItem?.relatedSlugs || [],
    occasions: item.occasions && item.occasions.length > 0 ? item.occasions : staticItem?.occasions || [],
    isDark: typeof item.isDark === 'boolean' ? item.isDark : staticItem?.isDark ?? false,
    scentProfile: {
      top: item.scentProfile?.top || staticItem?.scentProfile?.top || '',
      heart: item.scentProfile?.heart || staticItem?.scentProfile?.heart || '',
      base: item.scentProfile?.base || staticItem?.scentProfile?.base || '',
      family:
        sanitizeExtraitText(item.scentProfile?.family) ||
        sanitizeExtraitText(staticItem?.scentProfile?.family) ||
        'Eau de Parfum',
      concentration: sanitizeExtraitText(
        item.scentProfile?.concentration || staticItem?.scentProfile?.concentration
      ),
      longevity: item.scentProfile?.longevity || staticItem?.scentProfile?.longevity,
      sillage: item.scentProfile?.sillage || staticItem?.scentProfile?.sillage,
      maceration: item.scentProfile?.maceration || staticItem?.scentProfile?.maceration,
    },
    keyIngredients: mergedKeyIngredients,
  }
}

function normalizeHouseObject(item: Partial<HouseObject>, staticObj?: HouseObject): HouseObject {
  return {
    slug: item.slug || staticObj?.slug || '',
    updatedAt: item.updatedAt,
    seo: normalizeSeo(item.seo),
    name: item.name || staticObj?.name || '',
    price: typeof item.price === 'number' ? item.price : staticObj?.price ?? 0,
    volume: item.volume || staticObj?.volume,
    badge: sanitizeObjectBadge(item.badge) ?? sanitizeObjectBadge(staticObj?.badge),
    description: item.description || staticObj?.description || '',
    spec: item.spec || staticObj?.spec || '',
    image:
      optimizeSanityImageUrl(item.image, 1200) ||
      staticObj?.image ||
      '/images/objects/discovery-set-floating.webp',
    occasions: item.occasions && item.occasions.length > 0 ? item.occasions : staticObj?.occasions,
  }
}

/**
 * Fetches all perfumes from Sanity with automatic fallback to static catalog
 */
export const getLivePerfumes = cache(async (): Promise<Product[]> => {
  try {
    const data = await sanityFetch<Product[]>({
      query: PERFUMES_QUERY,
      tags: ['perfume'],
    })
    if (data && Array.isArray(data) && data.length > 0) {
      return data
        .filter((item) => Boolean(item?.slug))
        .map((item) => {
          const staticItem = PERFUMES.find((p) => p.slug === item.slug)
          return normalizePerfume(item, staticItem)
        })
    }
  } catch (error) {
    console.warn('[Sanity] Fetch failed, using static PERFUMES catalog:', error)
  }
  return PERFUMES
})

/**
 * Fetches a single perfume by slug with automatic fallback to static catalog
 */
export const getLivePerfumeBySlug = cache(async (slug: string): Promise<Product | undefined> => {
  const staticProduct = PERFUMES.find((p) => p.slug === slug)
  try {
    const data = await sanityFetch<Product>({
      query: PERFUME_BY_SLUG_QUERY,
      params: { slug },
      tags: ['perfume', `perfume:${slug}`],
    })
    if (data && data.slug) {
      return normalizePerfume(data, staticProduct)
    }
  } catch (error) {
    console.warn(`[Sanity] Fetch failed for ${slug}, using static fallback:`, error)
  }
  return staticProduct
})

/**
 * Fetches house objects (Discovery set, En route, etc.) with fallback
 */
export const getLiveObjects = cache(async (): Promise<HouseObject[]> => {
  try {
    const data = await sanityFetch<HouseObject[]>({
      query: OBJECTS_QUERY,
      tags: ['houseObject'],
    })
    if (data && Array.isArray(data) && data.length > 0) {
      return data
        .filter((item) => Boolean(item?.slug))
        .map((item) => {
          const staticObj = OBJECTS.find((o) => o.slug === item.slug)
          return normalizeHouseObject(item, staticObj)
        })
    }
  } catch (error) {
    console.warn('[Sanity] Fetch failed, using static OBJECTS catalog:', error)
  }
  return OBJECTS
})

/**
 * Fetches a single house object by slug with fallback
 */
export const getLiveObjectBySlug = cache(async (slug: string): Promise<HouseObject | undefined> => {
  const staticObj = OBJECTS.find((o) => o.slug === slug)
  try {
    const data = await sanityFetch<HouseObject>({
      query: OBJECT_BY_SLUG_QUERY,
      params: { slug },
      tags: ['houseObject', `houseObject:${slug}`],
    })
    if (data && data.slug) {
      return normalizeHouseObject(data, staticObj)
    }
  } catch (error) {
    console.warn(`[Sanity] Fetch failed for object ${slug}, using static fallback:`, error)
  }
  return staticObj
})

export interface HomepageData {
  updatedAt?: string
  patronsPromise?: string
  seo?: SeoMetadata
}

/**
 * Fetches Homepage editorial content from Sanity
 */
export const getLiveHomepage = cache(async (): Promise<HomepageData | null> => {
  try {
    const data = await sanityFetch<HomepageData>({
      query: HOMEPAGE_QUERY,
      tags: ['homePage'],
    })
    if (!data) return null
    return {
      updatedAt: data.updatedAt,
      patronsPromise: data.patronsPromise,
      seo: normalizeSeo(data.seo),
    }
  } catch (error) {
    console.warn('[Sanity] Fetch failed for homepage content:', error)
    return null
  }
})

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
export const getLiveSiteSettings = cache(async (): Promise<SiteSettingsData | null> => {
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
})

function deduplicateReviews(rows: PublicReview[]): PublicReview[] {
  const seen = new Map<string, PublicReview>()
  for (const row of rows) {
    if (!row?._id) continue
    const canonicalId = row._id.replace(/^drafts\./, '')
    // Prefer draft version if both exist so Studio edits reflect immediately
    if (!seen.has(canonicalId) || row._id.startsWith('drafts.')) {
      seen.set(canonicalId, {
        _id: canonicalId,
        rating: row.rating,
        name: row.name,
        city: row.city ?? null,
        title: row.title ?? null,
        body: row.body,
        wornFor: row.wornFor ?? null,
        purchaseChecked: row.purchaseChecked ?? null,
        submittedAt: row.submittedAt,
      })
    }
  }
  return Array.from(seen.values())
}

/**
 * Fetches approved reviews for one perfume or object.
 * Uses the server-side Sanity token (`perspective: "raw"`) when configured so reviews
 * stored privately under `drafts.review-*` (protecting reviewer email PII from public
 * dataset queries) render seamlessly once approved, while never projecting `email`.
 */
export const getApprovedReviews = cache(async (slug: string): Promise<PublicReview[]> => {
  try {
    const token = process.env.SANITY_API_WRITE_TOKEN?.trim()
    let data: PublicReview[] | null = null

    if (token) {
      const privateClient = createClient({
        projectId,
        dataset,
        apiVersion,
        token,
        useCdn: false,
        perspective: 'raw',
      })
      data = await privateClient.fetch<PublicReview[]>(
        APPROVED_REVIEWS_QUERY,
        { slug },
        {
          next: {
            revalidate: 60,
            tags: ['customerReview', `review:${slug}`],
          },
        }
      )
    } else {
      data = await sanityFetch<PublicReview[]>({
        query: APPROVED_REVIEWS_QUERY,
        params: { slug },
        tags: ['customerReview', `review:${slug}`],
      })
    }

    if (Array.isArray(data) && data.length > 0) {
      return deduplicateReviews(data)
    }
  } catch (error) {
    console.warn(`[Sanity] Fetch failed for reviews of ${slug}:`, error)
  }
  return REAL_APPROVED_REVIEWS[slug] ?? []
})
