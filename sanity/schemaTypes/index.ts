import { type SchemaTypeDefinition } from 'sanity'

import { scentProfile } from './objects/scentProfile'
import { keyIngredient } from './objects/keyIngredient'
import { perfume } from './documents/perfume'
import { houseObject } from './documents/houseObject'
import { customerReview } from './documents/customerReview'
import { legalPage } from './documents/legalPage'
import { order } from './documents/order'
import { correspondenceSubscriber } from './documents/correspondenceSubscriber'
import { homePage } from './singletons/homePage'
import { siteSettings } from './singletons/siteSettings'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    // Singletons
    siteSettings,
    homePage,

    // Documents
    order,
    perfume,
    houseObject,
    customerReview,
    correspondenceSubscriber,
    legalPage,

    // Objects
    scentProfile,
    keyIngredient,
  ],
}
