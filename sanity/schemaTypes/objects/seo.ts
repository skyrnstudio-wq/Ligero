import { defineField, defineType } from 'sanity'

/**
 * Reusable SEO metadata object for perfumes, house objects, homepage, and legal pages.
 * All fields are optional: when left blank, the storefront derives clean defaults
 * from the document's primary title, description, and photography.
 */
export const seo = defineType({
  name: 'seo',
  title: 'SEO & Social Sharing',
  type: 'object',
  options: {
    collapsible: true,
    collapsed: true,
  },
  fields: [
    defineField({
      name: 'title',
      title: 'Meta Title Override',
      type: 'string',
      description: 'Optional. Aim for 45 to 60 characters. Leave blank to use the default title.',
      validation: (rule) =>
        rule.max(70).warning('Titles longer than 60 characters may be truncated in search results.'),
    }),
    defineField({
      name: 'description',
      title: 'Meta Description Override',
      type: 'text',
      rows: 3,
      description: 'Optional. Aim for 140 to 160 characters. Plain, declarative copy.',
      validation: (rule) =>
        rule
          .max(170)
          .warning('Descriptions longer than 160 characters are typically truncated in search results.'),
    }),
    defineField({
      name: 'image',
      title: 'Social Share Image (Open Graph)',
      type: 'image',
      description: 'Optional 1200 x 630 image for WhatsApp, X, and LinkedIn previews.',
      options: { hotspot: true },
    }),
    defineField({
      name: 'noIndex',
      title: 'Hide from Search Engines (noindex)',
      type: 'boolean',
      description: 'When enabled, search engines are instructed not to index this page and it is omitted from sitemap.xml.',
      initialValue: false,
    }),
  ],
})
