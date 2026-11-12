import { defineField, defineType } from 'sanity'

export const legalPage = defineType({
  name: 'legalPage',
  title: 'Legal & Policy Page',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Page Title',
      type: 'string',
      description: 'e.g. Privacy Policy, Terms of Sale, Shipping & Returns',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'lastUpdated',
      title: 'Effective Date / Last Updated',
      type: 'string',
    }),
    defineField({
      name: 'content',
      title: 'Legal Prose Content',
      type: 'text',
      rows: 20,
      description: 'Full legal text compliant with E-commerce and DPDP regulations',
    }),
  ],
})
