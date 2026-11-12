import { createClient } from '@sanity/client'
import * as fs from 'fs'
import * as path from 'path'
import { PERFUMES, OBJECTS } from '../lib/products'

// Read .env.local natively without external dependencies
const envPath = path.resolve(process.cwd(), '.env.local')
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8')
  envContent.split('\n').forEach((line) => {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) return
    const match = trimmed.match(/^([^=]+)=(.*)$/)
    if (match) {
      const key = match[1].trim()
      const val = match[2].trim().replace(/^["']|["']$/g, '')
      process.env[key] = val
    }
  })
}

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const token = process.env.SANITY_API_WRITE_TOKEN

console.log('--- Ligero Parfum Sanity Ingestion Script ---')
console.log(`Project ID: ${projectId}`)
console.log(`Dataset:    ${dataset}`)

if (!token) {
  console.log('\n[!] NOTICE: SANITY_API_WRITE_TOKEN is missing in .env.local')
  console.log('To migrate existing content & upload high-resolution packshots to Sanity:')
  console.log('1. Visit: https://www.sanity.io/manage/project/' + projectId + '/api')
  console.log('2. Click "Add API token"')
  console.log('3. Name: "Migration Script", Role: "Editor"')
  console.log('4. Copy the generated token and append it to your .env.local file:')
  console.log('   SANITY_API_WRITE_TOKEN="your_token_here"')
  console.log('5. Re-run this script: npx tsx scripts/migrate-to-sanity.ts\n')
  process.exit(0)
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: '2024-11-01',
  useCdn: false,
})

// Helper to upload a local image to Sanity Asset pipeline
async function uploadImageIfFileExists(relativePath: string, filenameLabel: string) {
  const cleanPath = relativePath.startsWith('/') ? relativePath.slice(1) : relativePath
  const fullPath = path.resolve(process.cwd(), 'public', cleanPath)

  if (!fs.existsSync(fullPath)) {
    // Try without "public" if already in path
    const altPath = path.resolve(process.cwd(), cleanPath)
    if (!fs.existsSync(altPath)) {
      console.warn(`    ⚠️ File not found on disk: ${fullPath}`)
      return null
    }
  }

  const targetPath = fs.existsSync(fullPath) ? fullPath : path.resolve(process.cwd(), cleanPath)
  try {
    const fileStream = fs.createReadStream(targetPath)
    const asset = await client.assets.upload('image', fileStream, {
      filename: path.basename(targetPath),
      title: filenameLabel,
    })
    return {
      _type: 'image',
      asset: {
        _type: 'reference',
        _ref: asset._id,
      },
    }
  } catch (err) {
    console.error(`    ❌ Failed to upload asset ${targetPath}:`, err)
    return null
  }
}

async function migrate() {
  console.log('\n🚀 Starting content & asset migration to Sanity...\n')

  // 1. Migrate 7 Perfumes
  console.log('📦 1/4 Ingesting Fragrances...')
  for (const p of PERFUMES) {
    console.log(`  → Processing ${p.name} (${p.slug})...`)

    // Find and upload cutout packshot
    const cutoutAsset = await uploadImageIfFileExists(
      `/images/perfumes/cutouts/${p.slug}.webp`,
      `${p.name} Flacon Cutout`
    ) || await uploadImageIfFileExists(p.image, `${p.name} Packshot`)

    // Find and upload notes artwork
    const notesAsset = await uploadImageIfFileExists(
      `/images/perfumes/notes/${p.slug}.webp`,
      `${p.name} Olfactive Notes Artwork`
    )

    // Lifestyle gallery
    const galleryAssets = []
    if (p.gallery && p.gallery.length > 0) {
      for (let i = 0; i < p.gallery.length; i++) {
        const gal = await uploadImageIfFileExists(p.gallery[i], `${p.name} Gallery ${i + 1}`)
        if (gal) galleryAssets.push(gal)
      }
    }

    const docId = `perfume-${p.slug}`
    const doc = {
      _id: docId,
      _type: 'perfume',
      name: p.name,
      slug: { _type: 'slug', current: p.slug },
      subtitle: p.subtitle,
      volume: p.volume,
      price: p.price,
      badge: (p as any).badge || 'EXTRAIT DE PARFUM',
      oneLiner: p.oneLiner,
      notesUppercase: p.notesUppercase,
      notesPoem: p.notesPoem,
      ritual: p.ritual,
      material: p.material,
      provenance: p.provenance,
      isDark: Boolean(p.isDark),
      scentProfile: p.scentProfile,
      keyIngredients: p.keyIngredients,
      ...(cutoutAsset ? { image: cutoutAsset } : {}),
      ...(notesAsset ? { notesImage: notesAsset } : {}),
      ...(galleryAssets.length > 0 ? { gallery: galleryAssets } : {}),
    }

    await client.createOrReplace(doc)
    console.log(`    ✓ Saved ${p.name} to Sanity`)
  }

  // 2. Link Related Fragrances
  console.log('\n🔗 2/4 Linking Related Fragrances...')
  for (const p of PERFUMES) {
    if (p.relatedSlugs && p.relatedSlugs.length > 0) {
      const relatedRefs = p.relatedSlugs.map((relSlug) => ({
        _type: 'reference',
        _ref: `perfume-${relSlug}`,
        _key: `ref-${relSlug}`,
      }))

      await client.patch(`perfume-${p.slug}`).set({ relatedPerfumes: relatedRefs }).commit()
      console.log(`  ✓ Linked relations for ${p.name}`)
    }
  }

  // 3. Migrate House Objects
  console.log('\n📦 3/4 Ingesting House Objects & Sets...')
  for (const obj of OBJECTS) {
    console.log(`  → Processing ${obj.name} (${obj.slug})...`)
    const objAsset = await uploadImageIfFileExists(obj.image, `${obj.name} Photography`)

    const doc = {
      _id: `houseObject-${obj.slug}`,
      _type: 'houseObject',
      name: obj.name,
      slug: { _type: 'slug', current: obj.slug },
      price: obj.price,
      volume: obj.slug === 'discovery-set' ? '7 × 10 ml' : 'Car Diffuser',
      badge: obj.slug === 'discovery-set' ? '100% REDEEMABLE' : 'TRAVEL RITUAL',
      description: obj.description,
      spec: obj.spec,
      ...(objAsset ? { image: objAsset } : {}),
    }

    await client.createOrReplace(doc)
    console.log(`    ✓ Saved ${obj.name}`)
  }

  // 4. Initialize Homepage & Site Settings Singletons
  console.log('\n🏛️ 4/4 Initializing Singletons (Homepage Editorial & Settings)...')
  const heroAsset = await uploadImageIfFileExists(
    '/images/hero/perfume-mist.webp',
    'Hero Perfume Mist Photography'
  )
  const aubeCutout = await uploadImageIfFileExists(
    '/images/perfumes/cutouts/aube.webp',
    'Aubé Bottle Cutout'
  )

  const homeDoc = {
    _id: 'homePage',
    _type: 'homePage',
    title: 'Homepage Editorial',
    heroEyebrow: 'LIGERO PARFUM',
    heroHeading: 'An intimate obsession.',
    heroHeadingItalic: 'Crafted to be unforgettable.',
    heroCtaText: 'Explore the Collection',
    heroCtaLink: '/collection',
    ...(heroAsset ? { heroImage: heroAsset } : {}),
    featuredBadge: 'NEW RELEASE',
    featuredTitle: 'Aubé',
    featuredSubtitle: 'Extrait de Parfum',
    featuredDescription: 'Wild mountain mint and water jasmine hydro-distilled before sunrise.',
    featuredProductSlug: 'aube',
    ...(aubeCutout ? { featuredBottleCutout: aubeCutout } : {}),
    objectsEyebrow: 'Objects of Scent',
    objectsHeading: 'Vessels and travel rituals.',
    objectsDescription: 'Designed to accompany the senses across thresholds. Crafted with small-batch extrait maceration standards.',
    patronsEyebrow: 'Patrons',
    patronsHeading: 'The Private Salon',
    patronsDescription: 'Receive private allocations, seasonal extraits before public release, and correspondence from the perfumer.',
    patronsPromise: 'Four letters a year. Nothing else.',
  }
  await client.createOrReplace(homeDoc)
  console.log('  ✓ Saved Homepage Editorial singleton')

  const settingsDoc = {
    _id: 'siteSettings',
    _type: 'siteSettings',
    brandName: 'Ligero Parfum',
    tagline: 'Scent, worn like silk.',
    conciergeEmail: 'concierge@ligeroparfum.com',
    legalEntityName: 'Skyrn Studio Private Limited',
    footerCopyright: '© Ligero Parfum. All rights reserved.',
  }
  await client.createOrReplace(settingsDoc)
  console.log('  ✓ Saved Site Settings singleton')

  console.log('\n✨ Migration complete! All 7 perfumes, objects, and singletons are live in Sanity.')
  console.log('Open your Studio at: http://localhost:3000/studio to review and edit content.')
}

migrate().catch((err) => {
  console.error('\n❌ Ingestion error:', err)
  process.exit(1)
})
