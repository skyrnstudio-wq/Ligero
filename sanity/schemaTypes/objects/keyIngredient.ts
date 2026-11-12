import { defineField, defineType } from 'sanity'

export const keyIngredient = defineType({
  name: 'keyIngredient',
  title: 'Key Botanical Ingredient',
  type: 'object',
  fields: [
    defineField({
      name: 'name',
      title: 'Ingredient Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'origin',
      title: 'Botanical Note / Subtitle',
      type: 'string',
      description: 'Leave empty if omitted.',
    }),
    defineField({
      name: 'note',
      title: 'Olfactive Layer',
      type: 'string',
      description: 'e.g. Top / Head, Heart / Middle, Base / Enduring',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Botanical / Extraction Note',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Ingredient Botanical Photography',
      type: 'image',
      options: { hotspot: true },
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'origin',
      media: 'image',
    },
  },
})
