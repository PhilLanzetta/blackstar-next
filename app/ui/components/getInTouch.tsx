import type { DefaultPageSiteSettings } from '@/app/lib/types'
import styles from './getInTouch.module.css'
import Newsletter from '@/app/ui/components/newsletter'

type Props = {
  contactDetails?: DefaultPageSiteSettings['contactDetails']
  socialLinks?: DefaultPageSiteSettings['socialLinks']
}

export default function GetInTouch({ contactDetails, socialLinks }: Props) {
  if (!contactDetails && !socialLinks) return null

  return (
    <section className={styles.wrapper} id="contact">
      <h2 className={styles.heading}>Get In Touch</h2>
      <div className={styles.inner}>
        {contactDetails && (
          <div className={styles.details}>
            {contactDetails.address && (
              <div className={styles.address}>
                <p className={styles.header}>Address</p>
                <div
                  dangerouslySetInnerHTML={{ __html: contactDetails.address }}
                ></div>
              </div>
            )}
          </div>
        )}
        {contactDetails && (
          <div className={styles.details}>
            <p className={styles.header}>Contact Info</p>
            {contactDetails.phone && (
              <a href={`tel:${contactDetails.phone}`} className={styles.link}>
                {contactDetails.phone} Phone
              </a>
            )}
            {contactDetails.email && (
              <a
                href={`mailto:${contactDetails.email}`}
                className={styles.link}
              >
                {contactDetails.email}
              </a>
            )}
          </div>
        )}
        {socialLinks && (
          <div className={styles.details}>
            <p className={styles.header}>Social</p>
            {socialLinks.instagramUrl && (
              <a
                href={socialLinks.instagramUrl}
                className={styles.socialLink}
                target='_blank'
                rel='noopener noreferrer'
              >
                Instagram
              </a>
            )}
            {socialLinks.facebookUrl && (
              <a
                href={socialLinks.facebookUrl}
                className={styles.socialLink}
                target='_blank'
                rel='noopener noreferrer'
              >
                Facebook
              </a>
            )}
            {socialLinks.twitterUrl && (
              <a
                href={socialLinks.twitterUrl}
                className={styles.socialLink}
                target='_blank'
                rel='noopener noreferrer'
              >
                Twitter
              </a>
            )}
            {socialLinks.youtubeUrl && (
              <a
                href={socialLinks.youtubeUrl}
                className={styles.socialLink}
                target='_blank'
                rel='noopener noreferrer'
              >
                YouTube
              </a>
            )}
          </div>
        )}
        <div>
          SIGN UP FOR BLACKSTAR NEWS,<br></br>OUR MONTHLY NEWSLETTER
          <Newsletter />
        </div>
      </div>
    </section>
  )
}
