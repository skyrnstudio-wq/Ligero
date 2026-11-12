import { defineField, defineType } from 'sanity'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings & Metrology',
  type: 'document',
  fields: [
    defineField({
      name: 'brandName',
      title: 'Brand Name',
      type: 'string',
      initialValue: 'Ligero Parfum',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'tagline',
      title: 'Brand Tagline',
      type: 'string',
      initialValue: 'Scent, worn like silk.',
    }),
    defineField({
      name: 'conciergeEmail',
      title: 'Concierge Email',
      type: 'string',
      initialValue: 'concierge@ligeroparfum.com',
    }),
    defineField({
      name: 'legalEntityName',
      title: 'Entity Legal Name',
      type: 'string',
      initialValue: 'Skyrn Studio Private Limited',
      description: 'Required under Consumer Protection E-Commerce Rules',
    }),
    defineField({
      name: 'gstin',
      title: 'GSTIN Number',
      type: 'string',
      description: 'Tax identification displayed in footer',
    }),
    defineField({
      name: 'registeredAddress',
      title: 'Registered Office Address',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'grievanceOfficerName',
      title: 'Grievance Officer Name & Contact',
      type: 'string',
      description: 'Compliance requirement under DPDP Act 2023',
    }),
    defineField({
      name: 'footerCopyright',
      title: 'Footer Copyright Line',
      type: 'string',
      initialValue: '© Ligero Parfum. All rights reserved.',
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Site Settings & Metrology',
        subtitle: 'Brand info, legal addresses, GSTIN',
      }
    },
  },
})
