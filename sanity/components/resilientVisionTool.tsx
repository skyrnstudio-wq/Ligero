'use client'

import { visionTool, type VisionToolConfig } from '@sanity/vision'
import type { PluginOptions } from 'sanity'
import { withResilientChunks } from './resilientPlugin'

/**
 * Wraps `@sanity/vision` tool components and locale chunks so lazy CodeMirror
 * or resource bundle failures recover cleanly instead of crashing Sanity Studio
 * into a raw JSON error screen.
 */
export function resilientVisionTool(options?: VisionToolConfig): PluginOptions {
  return withResilientChunks(visionTool(options), 'Vision')
}
