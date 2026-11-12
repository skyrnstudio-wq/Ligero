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

      // Fragrance Collections
      S.documentTypeListItem('perfume').title('The Seven Perfumes'),
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
