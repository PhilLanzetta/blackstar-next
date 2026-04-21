import { getSeenPage } from '@/app/lib/queries'
import type {
  SeenFlexibleLayout,
  SeenArticlesLayout,
  SeenSpotlightContainedLayout,
  SeenAnchorLayout,
  SeenFeatureMediaLayout,
} from '@/app/lib/types'
import SeenArticles from '@/app/ui/components/seen/seenArticles'
import SeenSpotlightContained from '@/app/ui/components/seen/seenSpotlightContained'
import SeenFeatureMedia from '@/app/ui/components/seen/seenFeatureMedia'
import styles from './page.module.css'

export const revalidate = 3600

export default async function SeenPage() {
  const layouts = await getSeenPage()

  return (
    <main className={styles.main}>
      {layouts.map((layout: SeenFlexibleLayout, index: number) => {
        switch (layout.__typename) {
          case 'SeenFlexibleLayoutsLayoutsArticlesLayout':
            return (
              <SeenArticles key={index} data={layout as SeenArticlesLayout} />
            )
          case 'SeenFlexibleLayoutsLayoutsSpotlightContainedLayout':
            return (
              <SeenSpotlightContained
                key={index}
                data={layout as SeenSpotlightContainedLayout}
              />
            )
          case 'SeenFlexibleLayoutsLayoutsAnchorLayout':
            return (
              <div
                key={index}
                id={(layout as SeenAnchorLayout).anchorName ?? undefined}
              />
            )
          case 'SeenFlexibleLayoutsLayoutsFeatureMediaLayout':
            return (
              <SeenFeatureMedia
                key={index}
                data={layout as SeenFeatureMediaLayout}
              />
            )
          default:
            return null
        }
      })}
    </main>
  )
}
