import { type SchemaTypeDefinition } from 'sanity'

import { scentProfile } from './objects/scentProfile'
import { keyIngredient } from './objects/keyIngredient'
import { perfume } from './documents/perfume'
import { houseObject } from './documents/houseObject'
import { customerReview } from './documents/customerReview'
import { legalPage } from './documents/legalPage'
import { homePage } from './singletons/homePage'
import { siteSettings } from './singletons/siteSettings'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    // Singletons
    siteSettings,
    homePage,

    // Documents
    perfume,
    houseObject,
    customerReview,
    legalPage,

    // Objects
    scentProfile,
    keyIngredient,
  ],
}
