import { defineField, defineType } from 'sanity'

/**
 * Private subscriber records for The Correspondence newsletter.
 * Stored under `drafts.correspondence-*` so unauthenticated public GROQ queries
 * cannot read subscriber email addresses while authenticated team members can
 * view and manage them in Sanity Studio.
 */
export const correspondenceSubscriber = defineType({
  name: 'correspondenceSubscriber',
  title: 'Correspondence Subscriber',
  type: 'document',
  fields: [
    defineField({
      name: 'email',
      title: 'Email Address',
      type: 'string',
      validation: (rule) => rule.required().email(),
      readOnly: true,
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Subscribed', value: 'subscribed' },
          { title: 'Unsubscribed', value: 'unsubscribed' },
        ],
        layout: 'radio',
      },
      initialValue: 'subscribed',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'source',
      title: 'Form Variant',
      type: 'string',
      options: {
        list: [
          { title: 'Correspondence Section', value: 'default' },
          { title: 'Collection Strip', value: 'strip' },
        ],
      },
      readOnly: true,
    }),
    defineField({
      name: 'pagePath',
      title: 'Subscribed From Page',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'subscribedAt',
      title: 'Subscribed At',
      type: 'datetime',
      readOnly: true,
    }),
    defineField({
      name: 'lastSubmittedAt',
      title: 'Last Submitted At',
      type: 'datetime',
      readOnly: true,
    }),
  ],
  orderings: [
    {
      title: 'Newest first',
      name: 'subscribedAtDesc',
      by: [{ field: 'subscribedAt', direction: 'desc' }],
    },
  ],
  preview: {
    select: {
      email: 'email',
      status: 'status',
      subscribedAt: 'subscribedAt',
    },
    prepare({ email, status, subscribedAt }) {
      const dateLabel = subscribedAt
        ? new Date(subscribedAt).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })
        : 'Unknown date'
      return {
        title: email || 'Subscriber',
        subtitle: `${status || 'subscribed'} · ${dateLabel}`,
      }
    },
  },
})
