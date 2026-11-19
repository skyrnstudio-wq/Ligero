'use client'

import React from 'react'

const RELOAD_STAMP_KEY = 'ligero_studio_chunk_reload_at'
const RELOAD_COOLDOWN_MS = 15_000

export function isChunkLoadError(error: Error | null | undefined): boolean {
  if (!error) return false
  if (error.name === 'ChunkLoadError') return true
  return /Loading chunk [\w-]+ failed|Failed to fetch dynamically imported module|Importing a module script failed/i.test(
    error.message || ''
  )
}

interface StudioChunkErrorBoundaryProps {
  children: React.ReactNode
  label?: string
}

interface StudioChunkErrorBoundaryState {
  error: Error | null
}

/**
 * Catches lazy-loaded Sanity Studio / Vision chunk failures (such as stale build
 * hashes after a deployment or transient edge drops), performs at most one
 * guarded page reload within 15 seconds, and otherwise renders a recovery card.
 */
export class StudioChunkErrorBoundary extends React.Component<
  StudioChunkErrorBoundaryProps,
  StudioChunkErrorBoundaryState
> {
  constructor(props: StudioChunkErrorBoundaryProps) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error: Error): StudioChunkErrorBoundaryState {
    return { error }
  }

  componentDidCatch(error: Error) {
    if (!isChunkLoadError(error) || typeof window === 'undefined') {
      return
    }

    try {
      const now = Date.now()
      const lastReloadRaw = window.sessionStorage.getItem(RELOAD_STAMP_KEY)
      const lastReload = lastReloadRaw ? Number(lastReloadRaw) : 0

      if (!lastReload || Number.isNaN(lastReload) || now - lastReload > RELOAD_COOLDOWN_MS) {
        window.sessionStorage.setItem(RELOAD_STAMP_KEY, String(now))
        window.location.reload()
      }
    } catch {
      // sessionStorage may be restricted; fall back to manual reload UI
    }
  }

  private handleReload = () => {
    if (typeof window !== 'undefined') {
      window.location.reload()
    }
  }

  render() {
    const { error } = this.state
    if (!error) {
      return this.props.children
    }

    const label = this.props.label || 'Studio'
    const chunkFailure = isChunkLoadError(error)

    return (
      <div
        role="alert"
        style={{
          minHeight: '100%',
          height: '100%',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          backgroundColor: '#101418',
          color: '#EAE6DC',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        <div
          style={{
            maxWidth: '460px',
            width: '100%',
            border: '1px solid #2A3038',
            backgroundColor: '#161B20',
            borderRadius: '6px',
            padding: '24px',
          }}
        >
          <p
            style={{
              margin: '0 0 8px',
              fontSize: '15px',
              fontWeight: 600,
              color: '#EAE6DC',
            }}
          >
            {chunkFailure
              ? `${label} couldn't load a required script bundle`
              : `${label} encountered an unexpected error`}
          </p>
          <p
            style={{
              margin: '0 0 18px',
              fontSize: '13px',
              lineHeight: 1.5,
              color: '#A9A69C',
              wordBreak: 'break-word',
            }}
          >
            {chunkFailure
              ? 'This usually happens after a new deployment or a brief connection drop while loading the editor.'
              : error.message || 'Please reload the Studio to continue.'}
          </p>
          <button
            type="button"
            onClick={this.handleReload}
            style={{
              backgroundColor: '#EAE6DC',
              color: '#101418',
              border: 'none',
              borderRadius: '4px',
              padding: '9px 16px',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Reload Studio
          </button>
        </div>
      </div>
    )
  }
}
