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
    defineField({
      name: 'patronsPromise',
      title: 'The Correspondence Promise Note',
      type: 'string',
      description: 'Displayed beneath The Correspondence newsletter heading on the storefront.',
      initialValue: 'Four letters a year. Nothing else.',
    }),
    defineField({
      name: 'seo',
      title: 'SEO & Social Sharing',
      type: 'seo',
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Homepage Editorial',
        subtitle: 'The Correspondence',
      }
    },
  },
})
