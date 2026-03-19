import type { AnchorLayout } from '@/app/lib/types'

export default function AnchorBlock({ data }: { data: AnchorLayout }) {
  if (!data.anchorName) return null
  return (
    <div
      id={data.anchorName}
      style={{
        marginTop: '-100px',
        paddingTop: '100px',
        pointerEvents: 'none',
      }}
    />
  )
}
