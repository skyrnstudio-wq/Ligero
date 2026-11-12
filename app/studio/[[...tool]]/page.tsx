'use client'

import dynamic from 'next/dynamic'

const Studio = dynamic(
  () => import('./Studio').then((mod) => mod.Studio),
  {
    ssr: false,
    loading: () => (
      <div
        style={{
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#101418',
          color: '#EAE6DC',
          fontFamily: 'serif',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          fontSize: '12px',
        }}
      >
        Loading Ligero Atelier Studio...
      </div>
    ),
  }
)

export default function StudioPage() {
  return <Studio />
}
