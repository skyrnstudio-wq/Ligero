'use client'

import { NextStudio } from 'next-sanity/studio/client-component'
import config from '@/sanity.config'
import { StudioChunkErrorBoundary } from '@/sanity/components/StudioChunkErrorBoundary'

export function Studio() {
  return (
    <StudioChunkErrorBoundary label="Studio">
      <NextStudio config={config} />
    </StudioChunkErrorBoundary>
  )
}
