import type { StructureResolver } from 'sanity/structure'

// Custom Studio Desk Structure for Ligero Parfum
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Ligero Parfum Atelier')
    .items([
      // Pinned Singletons
      S.listItem()
        .title('Site Settings')
        .id('siteSettings')
        .child(
          S.document()
            .schemaType('siteSettings')
            .documentId('siteSettings')
            .title('Site Settings & Metrology')
        ),
      S.listItem()
        .title('Homepage Editorial')
        .id('homePage')
        .child(
          S.document()
            .schemaType('homePage')
            .documentId('homePage')
            .title('Homepage Storytelling')
        ),

      S.divider(),

      // Orders & Fulfilment
      S.listItem()
        .title('Orders & Fulfilment')
        .id('orders')
        .child(
          S.list()
            .title('Orders & Fulfilment')
            .items([
              S.listItem()
                .title('Paid — Ready to Dispatch')
                .id('orders-ready')
                .child(
                  S.documentList()
                    .title('Paid — Ready to Dispatch')
                    .schemaType('order')
                    .filter('_type == "order" && paymentStatus == "paid" && fulfilmentStatus == "processing"')
                    .defaultOrdering([{ field: 'paidAt', direction: 'desc' }])
                ),
              S.listItem()
                .title('Dispatched / In Transit')
                .id('orders-dispatched')
                .child(
                  S.documentList()
                    .title('Dispatched / In Transit')
                    .schemaType('order')
                    .filter('_type == "order" && fulfilmentStatus == "dispatched"')
                    .defaultOrdering([{ field: 'createdAt', direction: 'desc' }])
                ),
              S.listItem()
                .title('Delivered')
                .id('orders-delivered')
                .child(
                  S.documentList()
                    .title('Delivered')
                    .schemaType('order')
                    .filter('_type == "order" && fulfilmentStatus == "delivered"')
                    .defaultOrdering([{ field: 'createdAt', direction: 'desc' }])
                ),
              S.listItem()
                .title('Pending Payment')
                .id('orders-pending')
                .child(
                  S.documentList()
                    .title('Pending Payment')
                    .schemaType('order')
                    .filter('_type == "order" && paymentStatus == "pending"')
                    .defaultOrdering([{ field: 'createdAt', direction: 'desc' }])
                ),
              S.listItem()
                .title('Failed / Cancelled')
                .id('orders-failed')
                .child(
                  S.documentList()
                    .title('Failed / Cancelled')
                    .schemaType('order')
                    .filter('_type == "order" && (paymentStatus == "failed" || fulfilmentStatus == "cancelled")')
                    .defaultOrdering([{ field: 'createdAt', direction: 'desc' }])
                ),
              S.listItem()
                .title('All Orders')
                .id('orders-all')
                .child(
                  S.documentList()
                    .title('All Orders')
                    .schemaType('order')
                    .filter('_type == "order"')
                    .defaultOrdering([{ field: 'createdAt', direction: 'desc' }])
                ),
            ])
        ),

      S.divider(),

      // Fragrance Collections
      S.documentTypeListItem('perfume').title('Perfumes'),
      S.documentTypeListItem('houseObject').title('House Objects & Travel Sets'),

      S.divider(),

      // Review moderation: nothing shows on the site until approved
      S.listItem()
        .title('Reviews')
        .id('reviews')
        .child(
          S.list()
            .title('Reviews')
            .items([
              S.listItem()
                .title('Pending (read these first)')
                .id('reviews-pending')
                .child(
                  S.documentList()
                    .title('Pending reviews')
                    .schemaType('customerReview')
                    .filter('_type == "customerReview" && status == "pending"')
                    .defaultOrdering([{ field: 'submittedAt', direction: 'desc' }])
                ),
              S.listItem()
                .title('Approved (shown on the site)')
                .id('reviews-approved')
                .child(
                  S.documentList()
                    .title('Approved reviews')
                    .schemaType('customerReview')
                    .filter('_type == "customerReview" && status == "approved"')
                    .defaultOrdering([{ field: 'submittedAt', direction: 'desc' }])
                ),
              S.listItem()
                .title('Rejected')
                .id('reviews-rejected')
                .child(
                  S.documentList()
                    .title('Rejected reviews')
                    .schemaType('customerReview')
                    .filter('_type == "customerReview" && status == "rejected"')
                    .defaultOrdering([{ field: 'submittedAt', direction: 'desc' }])
                ),
            ])
        ),
      S.documentTypeListItem('legalPage').title('Legal & Compliance Policies'),
    ])
