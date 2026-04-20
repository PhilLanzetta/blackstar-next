import { notFound, redirect } from 'next/navigation'
import {
  getProgramEvent,
  getAllChildProgramEventSlugs,
} from '@/app/lib/queries'
import type {
  SpotlightHeroLayout,
  FeatureTextLayout,
  EventDetailsLayout,
  ContentLayout as ContentLayoutType,
  FlexibleLayout,
} from '@/app/lib/types'
import SpotlightHero from '@/app/ui/components/spotlightHero'
import FeatureText from '@/app/ui/components/featureText'
import EventDetails from '@/app/ui/components/eventDetails'
import ContentLayout from '@/app/ui/components/contentLayout'

export const dynamicParams = true
export const revalidate = 3600

type Props = {
  params: Promise<{ programType: string; slug: string; childSlug: string }>
}

export async function generateStaticParams() {
  const events = await getAllChildProgramEventSlugs()
 
  return events.map((e) => ({
    programType: e.programType,
    slug: e.slug,
    childSlug: e.childSlug,
  }))
}

export default async function ChildEventPage({ params }: Props) {
  const { childSlug } = await params
  const event = await getProgramEvent(childSlug)

  if (!event) return notFound()

  if (event.event?.redirect?.url) {
    redirect(event.event.redirect.url)
  }

  const layouts = (
    (event.flexibleLayouts?.layouts ?? []) as FlexibleLayout[]
  ).filter(Boolean)

  if (!layouts.length) return notFound()

  return (
    <main>
      {layouts.map((layout, index) => {
        switch (layout.__typename) {
          case 'FlexibleLayoutsLayoutsSpotlightHeroLayout':
            return (
              <SpotlightHero key={index} data={layout as SpotlightHeroLayout} />
            )
          case 'FlexibleLayoutsLayoutsFeatureTextLayout':
            return (
              <FeatureText key={index} data={layout as FeatureTextLayout} />
            )
          case 'FlexibleLayoutsLayoutsEventDetailsLayout':
            return (
              <EventDetails key={index} data={layout as EventDetailsLayout} />
            )
          case 'FlexibleLayoutsLayoutsContentLayout':
            return (
              <ContentLayout key={index} data={layout as ContentLayoutType} />
            )
          default:
            return null
        }
      })}
    </main>
  )
}
