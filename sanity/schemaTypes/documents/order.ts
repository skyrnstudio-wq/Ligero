import { defineArrayMember, defineField, defineType } from 'sanity'

/**
 * Customer order & fulfilment ledger persisted via Razorpay order creation,
 * checkout signature verification, and Razorpay server webhooks.
 */
export const order = defineType({
  name: 'order',
  title: 'Order',
  type: 'document',
  fields: [
    defineField({
      name: 'orderReference',
      title: 'Order Reference',
      type: 'string',
      validation: (rule) => rule.required(),
      readOnly: true,
    }),
    defineField({
      name: 'paymentStatus',
      title: 'Payment Status',
      type: 'string',
      options: {
        list: [
          { title: 'Pending', value: 'pending' },
          { title: 'Paid', value: 'paid' },
          { title: 'Failed', value: 'failed' },
          { title: 'Partially Refunded', value: 'partially_refunded' },
          { title: 'Refunded', value: 'refunded' },
        ],
        layout: 'radio',
      },
      initialValue: 'pending',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'fulfilmentStatus',
      title: 'Fulfilment Status',
      type: 'string',
      description: 'Enter Courier Partner and Tracking Number before switching to Dispatched so the dispatch email includes tracking details.',
      options: {
        list: [
          { title: 'Processing (Atelier)', value: 'processing' },
          { title: 'Dispatched / In Transit', value: 'dispatched' },
          { title: 'Delivered', value: 'delivered' },
          { title: 'Cancelled', value: 'cancelled' },
        ],
        layout: 'radio',
      },
      initialValue: 'processing',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'totalAmount',
      title: 'Total Amount (INR)',
      type: 'number',
      readOnly: true,
    }),
    defineField({
      name: 'amountPaise',
      title: 'Amount (Paise)',
      type: 'number',
      readOnly: true,
    }),
    defineField({
      name: 'currency',
      title: 'Currency',
      type: 'string',
      initialValue: 'INR',
      readOnly: true,
    }),
    defineField({
      name: 'razorpayOrderId',
      title: 'Razorpay Order ID',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'razorpayPaymentId',
      title: 'Razorpay Payment ID',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'razorpaySignature',
      title: 'Razorpay Signature',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'refundedAmountPaise',
      title: 'Refunded Amount (Paise)',
      type: 'number',
      readOnly: true,
    }),
    defineField({
      name: 'processedRefundIds',
      title: 'Processed Razorpay Refund IDs',
      type: 'array',
      of: [{ type: 'string' }],
      readOnly: true,
    }),
    defineField({
      name: 'customer',
      title: 'Customer & Shipping Address',
      type: 'object',
      fields: [
        defineField({ name: 'fullName', title: 'Full Name', type: 'string' }),
        defineField({ name: 'email', title: 'Email', type: 'string' }),
        defineField({ name: 'phone', title: 'Phone', type: 'string' }),
        defineField({ name: 'address', title: 'Address', type: 'string' }),
        defineField({ name: 'apartment', title: 'Apartment / Landmark', type: 'string' }),
        defineField({ name: 'city', title: 'City', type: 'string' }),
        defineField({ name: 'state', title: 'State', type: 'string' }),
        defineField({ name: 'pincode', title: 'PIN Code', type: 'string' }),
      ],
    }),
    defineField({
      name: 'giftNote',
      title: 'Gift Note',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'items',
      title: 'Order Items',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'orderItem',
          fields: [
            defineField({ name: 'slug', title: 'Slug', type: 'string' }),
            defineField({ name: 'name', title: 'Product Name', type: 'string' }),
            defineField({ name: 'volume', title: 'Volume', type: 'string' }),
            defineField({ name: 'quantity', title: 'Quantity', type: 'number' }),
            defineField({ name: 'price', title: 'Unit Price (INR)', type: 'number' }),
            defineField({ name: 'lineTotal', title: 'Line Total (INR)', type: 'number' }),
          ],
          preview: {
            select: {
              name: 'name',
              quantity: 'quantity',
              volume: 'volume',
              lineTotal: 'lineTotal',
            },
            prepare({ name, quantity, volume, lineTotal }) {
              return {
                title: `${name || 'Item'} × ${quantity || 1}`,
                subtitle: `${volume || ''} · ₹${Number(lineTotal || 0).toLocaleString('en-IN')}`,
              }
            },
          },
        }),
      ],
    }),
    defineField({
      name: 'courierName',
      title: 'Courier Partner',
      type: 'string',
    }),
    defineField({
      name: 'trackingNumber',
      title: 'Tracking Number / AWB',
      type: 'string',
    }),
    defineField({
      name: 'internalNotes',
      title: 'Internal Atelier Notes',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'createdAt',
      title: 'Created At',
      type: 'datetime',
      readOnly: true,
    }),
    defineField({
      name: 'paidAt',
      title: 'Paid At',
      type: 'datetime',
      readOnly: true,
    }),
    defineField({
      name: 'confirmationEmailSentAt',
      title: 'Confirmation Email Sent At',
      type: 'datetime',
      readOnly: true,
    }),
    defineField({
      name: 'dispatchEmailSentAt',
      title: 'Dispatch Email Sent At',
      type: 'datetime',
      readOnly: true,
    }),
  ],
  orderings: [
    {
      title: 'Newest first',
      name: 'createdAtDesc',
      by: [{ field: 'createdAt', direction: 'desc' }],
    },
  ],
  preview: {
    select: {
      orderReference: 'orderReference',
      customerName: 'customer.fullName',
      totalAmount: 'totalAmount',
      paymentStatus: 'paymentStatus',
      fulfilmentStatus: 'fulfilmentStatus',
    },
    prepare({ orderReference, customerName, totalAmount, paymentStatus, fulfilmentStatus }) {
      const pStatus = (paymentStatus || 'pending').toUpperCase()
      const fStatus = (fulfilmentStatus || 'processing').toUpperCase()
      return {
        title: `${orderReference || 'Order'} — ${customerName || 'Guest'}`,
        subtitle: `₹${Number(totalAmount || 0).toLocaleString('en-IN')} · ${pStatus} · ${fStatus}`,
      }
    },
  },
})
