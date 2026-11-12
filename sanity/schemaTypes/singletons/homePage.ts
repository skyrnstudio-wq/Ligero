import { defineField, defineType } from 'sanity'

export const homePage = defineType({
  name: 'homePage',
  title: 'Homepage Editorial',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Internal Document Title',
      type: 'string',
      initialValue: 'Homepage Editorial',
      readOnly: true,
    }),

    // Section 1: Hero
    defineField({
      name: 'heroEyebrow',
      title: 'Hero Eyebrow',
      type: 'string',
      initialValue: 'LIGERO PARFUM',
    }),
    defineField({
      name: 'heroHeading',
      title: 'Hero Primary Heading',
      type: 'string',
      initialValue: 'An intimate obsession.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'heroHeadingItalic',
      title: 'Hero Italic Subphrase',
      type: 'string',
      initialValue: 'Crafted to be unforgettable.',
    }),
    defineField({
      name: 'heroCtaText',
      title: 'Hero CTA Button Label',
      type: 'string',
      initialValue: 'Explore the Collection',
    }),
    defineField({
      name: 'heroCtaLink',
      title: 'Hero CTA Link URL',
      type: 'string',
      initialValue: '/collection',
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Photography Asset',
      type: 'image',
      description: 'Zero-zoom mist photography asset displayed on raw-silk background',
      options: { hotspot: true },
    }),

    // Section 2: Featured Campaign Banner (e.g. Aubé)
    defineField({
      name: 'featuredBadge',
      title: 'Featured Banner Badge',
      type: 'string',
      initialValue: 'NEW RELEASE',
    }),
    defineField({
      name: 'featuredTitle',
      title: 'Featured Banner Perfume Title',
      type: 'string',
      initialValue: 'Aubé',
    }),
    defineField({
      name: 'featuredSubtitle',
      title: 'Featured Banner Subtitle',
      type: 'string',
      initialValue: 'Extrait de Parfum',
    }),
    defineField({
      name: 'featuredDescription',
      title: 'Featured Banner Editorial Copy',
      type: 'text',
      rows: 3,
      initialValue: 'Wild mountain mint and water jasmine hydro-distilled before sunrise.',
    }),
    defineField({
      name: 'featuredProductSlug',
      title: 'Featured Product Target Slug',
      type: 'string',
      initialValue: 'aube',
    }),
    defineField({
      name: 'featuredBannerImage',
      title: 'Featured Campaign Lifestyle Asset',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'featuredBottleCutout',
      title: 'Featured Flacon Cutout Asset',
      type: 'image',
      options: { hotspot: true },
    }),

    // Section 3: Objects of Scent
    defineField({
      name: 'objectsEyebrow',
      title: 'Objects Section Eyebrow',
      type: 'string',
      initialValue: 'Objects of Scent',
    }),
    defineField({
      name: 'objectsHeading',
      title: 'Objects Section Heading',
      type: 'string',
      initialValue: 'Vessels and travel rituals.',
    }),
    defineField({
      name: 'objectsDescription',
      title: 'Objects Section Narrative',
      type: 'text',
      rows: 2,
      initialValue: 'Designed to accompany the senses across thresholds. Crafted with small-batch extrait maceration standards.',
    }),

    // Section 4: Patrons / Private Salon
    defineField({
      name: 'patronsEyebrow',
      title: 'Patrons Eyebrow',
      type: 'string',
      initialValue: 'Patrons',
    }),
    defineField({
      name: 'patronsHeading',
      title: 'Patrons Heading',
      type: 'string',
      initialValue: 'The Private Salon',
    }),
    defineField({
      name: 'patronsDescription',
      title: 'Patrons Narrative',
      type: 'text',
      rows: 3,
      initialValue: 'Receive private allocations, seasonal extraits before public release, and correspondence from the perfumer.',
    }),
    defineField({
      name: 'patronsPromise',
      title: 'Newsletter Promise Note',
      type: 'string',
      initialValue: 'Four letters a year. Nothing else.',
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Homepage Editorial',
        subtitle: 'Hero, Aubé Banner, Objects, Patrons',
      }
    },
  },
})
