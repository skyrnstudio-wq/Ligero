'use client'

/**
 * This configuration is used to for the Sanity Studio that’s mounted on the `/app/studio/[[...tool]]/page.tsx` route
 */

import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'

// Go to https://www.sanity.io/docs/api-versioning to learn how API versioning works
import {attemptChunkErrorReload, isChunkLoadError} from './lib/chunk-error'
import {apiVersion, dataset, projectId} from './sanity/env'
import {withResilientChunks} from './sanity/components/resilientPlugin'
import {resilientVisionTool} from './sanity/components/resilientVisionTool'
import {schema} from './sanity/schemaTypes'
import {structure} from './sanity/structure'

export default defineConfig({
  basePath: '/studio',
  projectId,
  dataset,
  // Add and edit the content schema in the './sanity/schemaTypes' folder
  schema,
  onUncaughtError: (error) => {
    if (isChunkLoadError(error)) {
      attemptChunkErrorReload()
    }
  },
  document: {
    // Keep Order and Correspondence Subscriber documents stored under their private `drafts.*`
    // paths so they are never published to the public root path of the dataset.
    actions: (prev, context) =>
      context.schemaType === 'order' || context.schemaType === 'correspondenceSubscriber'
        ? prev.filter(
            (action) =>
              action.action !== 'publish' &&
              action.action !== 'unpublish' &&
              action.action !== 'discardChanges' &&
              action.action !== 'duplicate'
          )
        : prev,
    newDocumentOptions: (prev) =>
      prev.filter(
        (item) =>
          item.templateId !== 'order' && item.templateId !== 'correspondenceSubscriber'
      ),
  },
  plugins: [
    withResilientChunks(structureTool({structure}), 'Structure'),
    // Vision is for querying with GROQ from inside the Studio
    // https://www.sanity.io/docs/the-vision-plugin
    resilientVisionTool({defaultApiVersion: apiVersion}),
  ],
})
