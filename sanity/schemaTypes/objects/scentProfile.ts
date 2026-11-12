import { defineField, defineType } from 'sanity'

export const scentProfile = defineType({
  name: 'scentProfile',
  title: 'Scent Architecture',
  type: 'object',
  fields: [
    defineField({
      name: 'top',
      title: 'Top / Head Notes',
      type: 'string',
      description: 'The opening impression (e.g. Wild Garden Mint · Bergamot)',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'heart',
      title: 'Heart / Character Notes',
      type: 'string',
      description: 'The core unfolding signature (e.g. Water Jasmine · Green Tea)',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'base',
      title: 'Base / Drydown Notes',
      type: 'string',
      description: 'The enduring skin contact memory (e.g. Green Cedarwood · Botanical Ambergris)',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'family',
      title: 'Olfactive Family',
      type: 'string',
      description: 'e.g. Crisp Green Aquatic, Velvet Floral Oriental, Dark Woody Amber',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'concentration',
      title: 'Concentration Specification',
      type: 'string',
      initialValue: 'Extrait de Parfum (30% Parfum Oil)',
    }),
    defineField({
      name: 'longevity',
      title: 'Longevity on Skin',
      type: 'string',
      initialValue: '10–12 Hours on Skin · 24 Hours on Raw Silk',
    }),
    defineField({
      name: 'sillage',
      title: 'Sillage / Scent Aura',
      type: 'string',
      initialValue: 'Crisp Radiance · 4–6 Feet Scent Aura',
    }),
    defineField({
      name: 'maceration',
      title: 'Maceration Period',
      type: 'string',
      initialValue: 'Cold Rested in Stainless Vessels',
    }),
  ],
})
