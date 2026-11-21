const groq = String.raw

// Fetch all perfumes for collection listing and carousel
export const PERFUMES_QUERY = groq`
  *[_type == "perfume"] | order(price asc) {
    _id,
    "updatedAt": _updatedAt,
    name,
    "slug": slug.current,
    subtitle,
    volume,
    price,
    badge,
    oneLiner,
    notesUppercase,
    notesPoem,
    ritual,
    material,
    provenance,
    isDark,
    "image": image.asset->url,
    "notesImage": notesImage.asset->url,
    "notesImageLqip": notesImage.asset->metadata.lqip,
    "gallery": gallery[].asset->url,
    "galleryLqips": gallery[].asset->metadata.lqip,
    scentProfile {
      top,
      heart,
      base,
      family,
      concentration,
      longevity,
      sillage,
      maceration
    },
    keyIngredients[] {
      name,
      note,
      description,
      "image": image.asset->url,
      "imageLqip": image.asset->metadata.lqip
    },
    "relatedSlugs": relatedPerfumes[]->slug.current,
    occasions,
    "seo": {
      "title": seo.title,
      "description": seo.description,
      "image": seo.image.asset->url,
      "noIndex": seo.noIndex == true
    }
  }
`

// Fetch single perfume detail by slug
export const PERFUME_BY_SLUG_QUERY = groq`
  *[_type == "perfume" && slug.current == $slug][0] {
    _id,
    "updatedAt": _updatedAt,
    name,
    "slug": slug.current,
    subtitle,
    volume,
    price,
    badge,
    oneLiner,
    notesUppercase,
    notesPoem,
    ritual,
    material,
    provenance,
    isDark,
    "image": image.asset->url,
    "notesImage": notesImage.asset->url,
    "notesImageLqip": notesImage.asset->metadata.lqip,
    "gallery": gallery[].asset->url,
    "galleryLqips": gallery[].asset->metadata.lqip,
    scentProfile {
      top,
      heart,
      base,
      family,
      concentration,
      longevity,
      sillage,
      maceration
    },
    keyIngredients[] {
      name,
      note,
      description,
      "image": image.asset->url,
      "imageLqip": image.asset->metadata.lqip
    },
    "relatedSlugs": relatedPerfumes[]->slug.current,
    occasions,
    "seo": {
      "title": seo.title,
      "description": seo.description,
      "image": seo.image.asset->url,
      "noIndex": seo.noIndex == true
    }
  }
`

// Fetch house objects (Discovery Set, En Route, etc.)
export const OBJECTS_QUERY = groq`
  *[_type == "houseObject"] | order(price desc) {
    _id,
    "updatedAt": _updatedAt,
    name,
    "slug": slug.current,
    price,
    volume,
    badge,
    description,
    spec,
    "image": image.asset->url,
    "imageLqip": image.asset->metadata.lqip,
    occasions,
    "seo": {
      "title": seo.title,
      "description": seo.description,
      "image": seo.image.asset->url,
      "noIndex": seo.noIndex == true
    }
  }
`

// Fetch single house object by slug
export const OBJECT_BY_SLUG_QUERY = groq`
  *[_type == "houseObject" && slug.current == $slug][0] {
    _id,
    "updatedAt": _updatedAt,
    name,
    "slug": slug.current,
    price,
    volume,
    badge,
    description,
    spec,
    "image": image.asset->url,
    "imageLqip": image.asset->metadata.lqip,
    occasions,
    "seo": {
      "title": seo.title,
      "description": seo.description,
      "image": seo.image.asset->url,
      "noIndex": seo.noIndex == true
    }
  }
`

// Fetch Homepage Editorial Singleton
export const HOMEPAGE_QUERY = groq`
  *[_type == "homePage"][0] {
    "updatedAt": _updatedAt,
    patronsPromise,
    "seo": {
      "title": seo.title,
      "description": seo.description,
      "image": seo.image.asset->url,
      "noIndex": seo.noIndex == true
    }
  }
`

// Fetch Site Settings Singleton
export const SITE_SETTINGS_QUERY = groq`
  *[_type == "siteSettings"][0] {
    brandName,
    tagline,
    conciergeEmail,
    legalEntityName,
    gstin,
    registeredAddress,
    grievanceOfficerName,
    footerCopyright
  }
`

// Approved reviews only. The reviewer's email is never projected.
export const APPROVED_REVIEWS_QUERY = `
  *[_type == "customerReview" && perfumeSlug == $slug && status == "approved"]
  | order(submittedAt desc) {
    _id,
    rating,
    name,
    city,
    title,
    body,
    wornFor,
    purchaseChecked,
    submittedAt
  }
`
