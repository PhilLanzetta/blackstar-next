import { notFound } from 'next/navigation'
import { getSeenSubPage, getAllSeenSubPageSlugs } from '@/app/lib/queries'
import type {
  SeenFlexibleLayout,
  SeenFeatureTextLayout,
  SeenSpotlightLayout,
  SeenAccordionLayout,
  SeenStockistsLayout,
  SeenContactDetailsLayout,
  SeenArticlesLayout,
  SeenAnchorLayout,
  SeenListLayout,
  SeenIssueCreditsLayout,
} from '@/app/lib/types'
import SeenFeatureText from '@/app/ui/components/seen/seenFeatureText'
import SeenSpotlight from '@/app/ui/components/seen/seenSpotlight'
import SeenAccordion from '@/app/ui/components/seen/seenAccordion'
import SeenStockists from '@/app/ui/components/seen/seenStockists'
import SeenContactDetails from '@/app/ui/components/seen/seenContactDetails'
import SeenArticles from '@/app/ui/components/seen/seenArticles'
import SeenList from '@/app/ui/components/seen/seenList'
import SeenIssueCredits from '@/app/ui/components/seen/seenIssueCredits'
import styles from './page.module.css'

export const dynamicParams = false
export const revalidate = 3600

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const slugs = await getAllSeenSubPageSlugs()
  return slugs.map((slug) => ({ slug }))
}

export default async function SeenSubPage({ params }: Props) {
  const { slug } = await params
  const layouts = await getSeenSubPage(slug)

  if (!layouts.length) return notFound()

  return (
    <main className={styles.main}>
      {layouts.map((layout: SeenFlexibleLayout, index: number) => {
        switch (layout.__typename) {
          case 'SeenFlexibleLayoutsLayoutsFeatureTextLayout':
            return (
              <SeenFeatureText
                key={index}
                data={layout as SeenFeatureTextLayout}
              />
            )
          case 'SeenFlexibleLayoutsLayoutsSpotlightLayout':
            return (
              <SeenSpotlight key={index} data={layout as SeenSpotlightLayout} />
            )
          case 'SeenFlexibleLayoutsLayoutsAccordionLayout':
            return (
              <SeenAccordion key={index} data={layout as SeenAccordionLayout} />
            )
          case 'SeenFlexibleLayoutsLayoutsStockistsLayout':
            return (
              <SeenStockists key={index} data={layout as SeenStockistsLayout} />
            )
          case 'SeenFlexibleLayoutsLayoutsContactDetailsLayout':
            return (
              <SeenContactDetails
                key={index}
                data={layout as SeenContactDetailsLayout}
              />
            )
          case 'SeenFlexibleLayoutsLayoutsArticlesLayout':
            return (
              <div
                key={index}
                className={slug === 'order' ? styles.articleWrapper : undefined}
              >
                <SeenArticles data={layout as SeenArticlesLayout} />
              </div>
            )
          case 'SeenFlexibleLayoutsLayoutsAnchorLayout':
            return (
              <div
                key={index}
                id={(layout as SeenAnchorLayout).anchorName ?? undefined}
              />
            )
          case 'SeenFlexibleLayoutsLayoutsListLayout':
            return <SeenList key={index} data={layout as SeenListLayout} />
          case 'SeenFlexibleLayoutsLayoutsIssueCreditsLayout':
            return (
              <SeenIssueCredits
                key={index}
                data={layout as SeenIssueCreditsLayout}
              />
            )
          default:
            return null
        }
      })}
    </main>
  )
}
