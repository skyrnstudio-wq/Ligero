'use client'

import React, { Suspense } from 'react'
import type { LocaleResourceBundle, PluginOptions, Tool } from 'sanity'
import {
  attemptChunkErrorReload,
  isChunkLoadError,
  retryChunkImport,
} from '@/lib/chunk-error'
import { StudioChunkErrorBoundary } from './StudioChunkErrorBoundary'

function wrapTool(tool: Tool, fallbackLabel?: string): Tool {
  const OriginalComponent = tool.component
  const label = tool.title || fallbackLabel || 'Studio'

  function ResilientToolWrapper(props: { tool: Tool }) {
    return (
      <StudioChunkErrorBoundary label={label}>
        <Suspense
          fallback={
            <div style={{ padding: 24, fontSize: 13 }}>Loading {label}…</div>
          }
        >
          <OriginalComponent {...props} />
        </Suspense>
      </StudioChunkErrorBoundary>
    )
  }

  ResilientToolWrapper.displayName = `ResilientTool(${tool.name})`

  return {
    ...tool,
    component: ResilientToolWrapper,
  }
}

function wrapLocaleBundle(bundle: LocaleResourceBundle): LocaleResourceBundle {
  const loadResources = bundle.resources
  if (typeof loadResources !== 'function') {
    return bundle
  }

  return {
    ...bundle,
    resources: () =>
      retryChunkImport(loadResources).catch((error) => {
        if (isChunkLoadError(error)) {
          attemptChunkErrorReload()
          return {}
        }
        throw error
      }),
  }
}

/**
 * Wraps a Sanity plugin's lazy tool components and dynamic i18n resource
 * loaders so transient chunk errors retry automatically and stale-deployment
 * ChunkLoadErrors trigger a guarded reload instead of crashing Studio.
 */
export function withResilientChunks(
  plugin: PluginOptions,
  fallbackLabel?: string
): PluginOptions {
  const wrappedTools: PluginOptions['tools'] = Array.isArray(plugin.tools)
    ? plugin.tools.map((tool) => wrapTool(tool, fallbackLabel))
    : typeof plugin.tools === 'function'
      ? (prev, context) => {
          const toolResolver = plugin.tools as Exclude<
            PluginOptions['tools'],
            Tool[] | undefined
          >
          return toolResolver(prev, context).map((tool) =>
            wrapTool(tool, fallbackLabel)
          )
        }
      : plugin.tools

  const baseBundles = plugin.i18n?.bundles
  const wrappedBundles = Array.isArray(baseBundles)
    ? baseBundles.map(wrapLocaleBundle)
    : baseBundles

  return {
    ...plugin,
    tools: wrappedTools,
    ...(plugin.i18n
      ? {
          i18n: {
            ...plugin.i18n,
            bundles: wrappedBundles,
          },
        }
      : {}),
  }
}
