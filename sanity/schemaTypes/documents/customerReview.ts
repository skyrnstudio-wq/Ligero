import { defineField, defineType } from 'sanity'

/**
 * A review written by a visitor on a product page.
 * Submissions arrive with status "pending" and are never shown on the site
 * until someone at the house sets the status to "approved".
 * Averages and counts are computed from approved reviews at query time,
 * nothing is stored or typed in by hand.
 */
export const customerReview = defineType({
  name: 'customerReview',
  title: 'Review',
  type: 'document',
  fields: [
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Pending (not shown)', value: 'pending' },
          { title: 'Approved (shown on the site)', value: 'approved' },
          { title: 'Rejected (not shown)', value: 'rejected' },
        ],
        layout: 'radio',
      },
      initialValue: 'pending',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'perfumeSlug',
      title: 'Perfume',
      type: 'string',
      description: 'Slug of the perfume page this review belongs to, e.g. noctis',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'rating',
      title: 'Rating (1 to 5)',
      type: 'number',
      validation: (rule) => rule.required().integer().min(1).max(5),
    }),
    defineField({
      name: 'name',
      title: 'Name shown on the review',
      type: 'string',
      validation: (rule) => rule.required().max(60),
    }),
    defineField({
      name: 'city',
      title: 'City',
      type: 'string',
      validation: (rule) => rule.max(60),
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.max(100),
    }),
    defineField({
      name: 'body',
      title: 'Review',
      type: 'text',
      rows: 5,
      validation: (rule) => rule.required().min(20).max(1200),
    }),
    defineField({
      name: 'wornFor',
      title: 'Worn for',
      type: 'string',
      options: {
        list: [
          { title: 'Less than a week', value: 'less-than-a-week' },
          { title: 'A few weeks', value: 'a-few-weeks' },
          { title: 'Several months', value: 'several-months' },
          { title: 'A year or more', value: 'a-year-or-more' },
        ],
      },
    }),
    defineField({
      name: 'email',
      title: 'Email (private, never shown on the site)',
      type: 'string',
      description:
        'Used only to check the reviewer bought the perfume and to reply. Not exposed by any site query.',
    }),
    defineField({
      name: 'purchaseChecked',
      title: 'Purchase checked by the house',
      type: 'boolean',
      description:
        'Tick only after matching the email to a real order. Approved reviews with this ticked show a "Purchase checked" mark.',
      initialValue: false,
    }),
    defineField({
      name: 'submittedAt',
      title: 'Submitted at',
      type: 'datetime',
      readOnly: true,
    }),
  ],
  orderings: [
    {
      title: 'Newest first',
      name: 'submittedAtDesc',
      by: [{ field: 'submittedAt', direction: 'desc' }],
    },
  ],
  preview: {
    select: {
      title: 'title',
      name: 'name',
      perfume: 'perfumeSlug',
      rating: 'rating',
      status: 'status',
    },
    prepare({ title, name, perfume, rating, status }) {
      return {
        title: title || `${name} on ${perfume}`,
        subtitle: `${'★'.repeat(rating || 0)}  ${perfume}  ·  ${status}`,
      }
    },
  },
})
