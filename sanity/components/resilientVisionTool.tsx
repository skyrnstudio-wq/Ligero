'use client'

import React, { Suspense } from 'react'
import { visionTool, type VisionToolConfig } from '@sanity/vision'
import type { PluginOptions, Tool } from 'sanity'
import { StudioChunkErrorBoundary } from './StudioChunkErrorBoundary'

/**
 * Wraps `@sanity/vision` tool components in a local `StudioChunkErrorBoundary`
 * so lazy CodeMirror chunk failures recover cleanly instead of crashing the
 * whole Sanity Studio shell into a raw JSON error screen.
 */
export function resilientVisionTool(options?: VisionToolConfig): PluginOptions {
  const base = visionTool(options)
  const baseTools = Array.isArray(base.tools) ? base.tools : []

  const wrappedTools: Tool[] = baseTools.map((tool) => {
    const OriginalComponent = tool.component

    function ResilientVisionWrapper(props: { tool: Tool }) {
      return (
        <StudioChunkErrorBoundary label="Vision">
          <Suspense fallback={<div style={{ padding: 24, fontSize: 13 }}>Loading Vision…</div>}>
            <OriginalComponent {...props} />
          </Suspense>
        </StudioChunkErrorBoundary>
      )
    }

    return {
      ...tool,
      component: ResilientVisionWrapper,
    }
  })

  return {
    ...base,
    tools: wrappedTools,
  }
}
