'use client'

import React from 'react'
import { attemptChunkErrorReload, isChunkLoadError } from '@/lib/chunk-error'

export { isChunkLoadError }

interface StudioChunkErrorBoundaryProps {
  children: React.ReactNode
  label?: string
  fullScreen?: boolean
  listenUnhandledRejections?: boolean
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

  componentDidMount() {
    if (this.props.listenUnhandledRejections && typeof window !== 'undefined') {
      window.addEventListener('unhandledrejection', this.handleUnhandledRejection)
    }
  }

  componentWillUnmount() {
    if (this.props.listenUnhandledRejections && typeof window !== 'undefined') {
      window.removeEventListener('unhandledrejection', this.handleUnhandledRejection)
    }
  }

  componentDidCatch(error: Error) {
    if (isChunkLoadError(error)) {
      attemptChunkErrorReload()
    }
  }

  private handleUnhandledRejection = (event: PromiseRejectionEvent) => {
    if (!isChunkLoadError(event.reason)) {
      return
    }
    event.preventDefault()
    if (!attemptChunkErrorReload()) {
      const error =
        event.reason instanceof Error
          ? event.reason
          : new Error(String(event.reason || 'Loading chunk failed'))
      this.setState({ error })
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
          minHeight: this.props.fullScreen ? '100dvh' : '100%',
          height: this.props.fullScreen ? 'auto' : '100%',
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
