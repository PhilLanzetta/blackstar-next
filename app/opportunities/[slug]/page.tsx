import { notFound } from 'next/navigation'
import { draftMode } from 'next/headers'
import Link from 'next/link'
import { getOpportunity, getAllOpportunitySlugs } from '@/app/lib/queries'
import { cleanHtml } from '@/app/lib/utils/cleanHtml'
import styles from './page.module.css'
import { getOpportunityPreview } from '@/app/lib/previewQueries'

export const dynamicParams = false
export const revalidate = 3600

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const slugs = await getAllOpportunitySlugs()
  return slugs.map((slug) => ({ slug }))
}

export default async function OpportunityPage({ params }: Props) {
  const { slug } = await params
  const { isEnabled: isPreview } = await draftMode()
  const opportunity = isPreview
    ? await getOpportunityPreview(slug)
    : await getOpportunity(slug)

  if (!opportunity) return notFound()

  const types = opportunity.opportunityTypes?.nodes ?? []
  const pdf = opportunity.opportunityAcf?.downloadPdf?.node?.mediaItemUrl

  return (
    <main>
      <div className={styles.heading}>
        <h1 className={styles.title}>{opportunity.title}</h1>
        {types.length > 0 && (
          <p className={styles.types}>
            ({types.map((t: { name: string }) => t.name).join(', ')})
          </p>
        )}
      </div>
      <div className={styles.container}>
        {opportunity.content && (
          <div
            className={styles.content}
            dangerouslySetInnerHTML={{ __html: cleanHtml(opportunity.content) }}
          />
        )}
      </div>
      <div className={styles.actions}>
        <Link href='/about#opportunities' className={styles.backLink}>
          ← Back to Opportunities
        </Link>
        {pdf && (
          <a
            href={pdf}
            target='_blank'
            rel='noopener noreferrer'
            className={styles.pdfButton}
          >
            DOWNLOAD PDF
          </a>
        )}
      </div>
    </main>
  )
}
