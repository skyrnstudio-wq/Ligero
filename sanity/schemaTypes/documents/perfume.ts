import { defineArrayMember, defineField, defineType } from 'sanity'

export const perfume = defineType({
  name: 'perfume',
  title: 'Perfume',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Perfume Name',
      type: 'string',
      description: 'e.g. Aubé, Fleur, Ambre Doux, Noctis, Blanc, Marée, Noir Cacao',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name', maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle / Sensory Mood',
      type: 'string',
      description: 'e.g. Fresh. Vibrant. Awakening. or Seductive. Shadowy. Enduring.',
    }),
    defineField({
      name: 'volume',
      title: 'Volume & Concentration String',
      type: 'string',
      initialValue: '50 ml · Extrait de Parfum',
    }),
    defineField({
      name: 'price',
      title: 'Price in INR (₹)',
      type: 'number',
      description: 'All taxes inclusive retail price',
      validation: (rule) => rule.required().min(0),
    }),
    defineField({
      name: 'badge',
      title: 'Curation Badge',
      type: 'string',
      description: 'e.g. EXTRAIT DE PARFUM, BEST-SELLER, PRIVATE RESERVE',
    }),
    defineField({
      name: 'oneLiner',
      title: 'One-line Essence Statement',
      type: 'text',
      rows: 2,
      description: 'Appears on PDP summary and collection cards',
    }),
    defineField({
      name: 'notesUppercase',
      title: 'Notes Headline (Uppercase)',
      type: 'string',
      description: 'e.g. CRISP MINT · WATER JASMINE · GREEN CEDAR',
    }),
    defineField({
      name: 'notesPoem',
      title: 'Three-line Olfactive Stanza',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Three poetic phrases displayed in the scent card',
      validation: (rule) => rule.length(3),
    }),
    defineField({
      name: 'ritual',
      title: 'Application Ritual',
      type: 'text',
      rows: 3,
      description: 'Guidance on skin contact and pulse point application',
    }),
    defineField({
      name: 'material',
      title: 'Flacon & Hardware Craft',
      type: 'text',
      rows: 3,
      description: 'Details on the glass flacon, brass atomiser, raw silk pouch',
    }),
    defineField({
      name: 'provenance',
      title: 'Provenance & Extraction Heritage',
      type: 'text',
      rows: 3,
      description: 'Terroir, botanical sourcing and resting details',
    }),
    defineField({
      name: 'image',
      title: 'Main Bottle Flacon Asset (Cutout/Transparent)',
      type: 'image',
      options: { hotspot: true },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'notesImage',
      title: 'Olfactive Notes Artwork / Botanical Asset',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'gallery',
      title: 'Editorial & Lifestyle Gallery',
      type: 'array',
      of: [defineArrayMember({ type: 'image', options: { hotspot: true } })],
    }),
    defineField({
      name: 'isDark',
      title: 'Noctis Dark Mood Aesthetic',
      type: 'boolean',
      description: 'When enabled, PDP renders with the dark #101418 palette instead of raw silk',
      initialValue: false,
    }),
    defineField({
      name: 'scentProfile',
      title: 'Scent Architecture',
      type: 'scentProfile',
    }),
    defineField({
      name: 'keyIngredients',
      title: 'Key Botanical Ingredients',
      type: 'array',
      of: [defineArrayMember({ type: 'keyIngredient' })],
    }),
    defineField({
      name: 'relatedPerfumes',
      title: 'Recommended Harmonizing Fragrances',
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'perfume' }] })],
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'scentProfile.family',
      price: 'price',
      media: 'image',
    },
    prepare({ title, subtitle, price, media }) {
      return {
        title,
        subtitle: `${subtitle || 'Extrait de Parfum'} — ₹${price || ''}`,
        media,
      }
    },
  },
})
