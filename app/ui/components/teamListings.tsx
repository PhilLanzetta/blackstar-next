'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import type { TeamListingsLayout, Biography } from '@/app/lib/types'
import styles from './teamListings.module.css'
import { AnimatePresence, motion } from 'framer-motion'

type Props = {
  data: TeamListingsLayout
}

function BioModal({ bio, onClose }: { bio: Biography; onClose: () => void }) {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button
          className={styles.closeButton}
          onClick={onClose}
          aria-label='Close'
        >
          ✕
        </button>
        <div className={styles.modalInner}>
          {bio.featuredImage?.node.sourceUrl && (
            <div className={styles.modalImage}>
              <Image
                src={bio.featuredImage.node.sourceUrl}
                alt={bio.featuredImage.node.altText ?? ''}
                width={bio.featuredImage.node.mediaDetails?.width ?? 400}
                height={bio.featuredImage.node.mediaDetails?.height ?? 400}
                className={styles.image}
              />
            </div>
          )}
          <div className={styles.modalContent}>
            <div className={styles.modalMeta}>
              {bio.biographyAcf?.pronouns && (
                <span className={styles.pronouns}>
                  {bio.biographyAcf.pronouns}
                </span>
              )}
              <h3 className={styles.name}>{bio.title}</h3>
              {bio.biographyAcf?.position && (
                <p className={styles.position}>
                  {bio.biographyAcf.position}
                </p>
              )}
              {bio.biographyAcf?.emailAddress && (
                <a
                  href={`mailto:${bio.biographyAcf.emailAddress}`}
                  className={styles.email}
                >
                  {bio.biographyAcf.emailAddress}
                </a>
              )}
            </div>
            {bio.content && (
              <div
                className={styles.modalBody}
                dangerouslySetInnerHTML={{ __html: bio.content }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function BioCard({ bio, onClick }: { bio: Biography; onClick: () => void }) {
  return (
    <div className={styles.card}>
      {bio.featuredImage?.node.sourceUrl && (
        <div className={styles.cardImage}>
          <Image
            src={bio.featuredImage.node.sourceUrl}
            alt={bio.featuredImage.node.altText ?? ''}
            width={bio.featuredImage.node.mediaDetails?.width ?? 400}
            height={bio.featuredImage.node.mediaDetails?.height ?? 400}
            className={styles.image}
          />
        </div>
      )}
      <div className={styles.cardMeta}>
        {bio.biographyAcf?.pronouns && (
          <span className={styles.pronouns}>{bio.biographyAcf.pronouns}</span>
        )}
      </div>
      <div className={styles.cardContent}>
        <h3 className={styles.name}>{bio.title}</h3>
        {bio.biographyAcf?.position && (
          <p className={styles.position}>{bio.biographyAcf.position}</p>
        )}
      </div>
      <div className={styles.buttonHolder}>
        <button className={styles.readMore} onClick={onClick}>
          Read More
        </button>
      </div>
    </div>
  )
}

export default function TeamListings({ data }: Props) {
  const [selectedBio, setSelectedBio] = useState<Biography | null>(null)

  useEffect(() => {
    if (selectedBio) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [selectedBio])

  const biographies = data.collection.nodes
    .filter((node) => node.__typename === 'BioCollection')
    .flatMap((node) => node.biographies.nodes)
    .sort((a, b) => a.title.localeCompare(b.title))

  if (!biographies.length) return null

  return (
    <section className={styles.wrapper}>
      {data.title && <h2>{data.title}</h2>}
      <div className={styles.grid}>
        {biographies.map((bio, index) => (
          <BioCard key={index} bio={bio} onClick={() => setSelectedBio(bio)} />
        ))}
      </div>

      <AnimatePresence>
        {selectedBio && (
          <motion.div
            className={styles.overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setSelectedBio(null)}
          >
            <motion.div
              className={styles.modal}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
            >
              <BioModal
                bio={selectedBio}
                onClose={() => setSelectedBio(null)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
