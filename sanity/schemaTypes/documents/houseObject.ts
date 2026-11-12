import { defineField, defineType } from 'sanity'

export const houseObject = defineType({
  name: 'houseObject',
  title: 'House Object & Ritual',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Object Name',
      type: 'string',
      description: 'e.g. The Discovery Set, En Route Car Diffuser',
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
      name: 'price',
      title: 'Price in INR (₹)',
      type: 'number',
      validation: (rule) => rule.required().min(0),
    }),
    defineField({
      name: 'volume',
      title: 'Format / Volume',
      type: 'string',
      description: 'e.g. 7 × 10 ml or Car Diffuser (Solid Ceramic)',
    }),
    defineField({
      name: 'badge',
      title: 'Badge',
      type: 'string',
      description: 'e.g. 100% REDEEMABLE, TRAVEL RITUAL',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'spec',
      title: 'Specification / Materials',
      type: 'string',
      description: 'e.g. 7 glass flacons with raw silk travel pouch',
    }),
    defineField({
      name: 'image',
      title: 'Object Photography',
      type: 'image',
      options: { hotspot: true },
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'volume',
      price: 'price',
      media: 'image',
    },
    prepare({ title, subtitle, price, media }) {
      return {
        title,
        subtitle: `${subtitle || ''} — ₹${price || ''}`,
        media,
      }
    },
  },
})
