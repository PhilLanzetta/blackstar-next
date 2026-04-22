'use client'
import styles from './footer.module.css'
import Link from 'next/link'
import { FooterQuery, SiteSettingsAcf } from '../lib/types'
import { useWindowSize } from 'usehooks-ts'
import Newsletter from './components/newsletter'

interface FooterProps {
  footerNav: SiteSettingsAcf
  pageBrand?: string | null
}

export function Footer({ footerNav, pageBrand }: FooterProps) {
  const { width } = useWindowSize()
  const isMobile = width < 601
  const mobileBottom = width < 760
  const isFestival = pageBrand === 'festival'

  return (
    <div className={isFestival ? styles.footerFestival : styles.footer}>
      <div className={styles.footerTop}>
        <div>
          <Link href='/about'>About</Link>
        </div>
        <div>
          <Link href='/festival'>Festival</Link>
          <Link href='/programs'>Programs</Link>
        </div>
        <div>
          <Link href='/support'>Support</Link>
          <Link href='/shop'>Shop</Link>
        </div>
        <div>
          <a
            href={footerNav.socialLinks.instagramUrl}
            target='_blank'
            rel='noreferrer'
          >
            Instagram
          </a>
          <a
            href={footerNav.socialLinks.twitterUrl}
            target='_blank'
            rel='noreferrer'
          >
            Twitter
          </a>
          <a
            href={footerNav.socialLinks.facebookUrl}
            target='_blank'
            rel='noreferrer'
          >
            Facebook
          </a>
          <a
            href={footerNav.socialLinks.youtubeUrl}
            target='_blank'
            rel='noreferrer'
          >
            Youtube
          </a>
        </div>
        {!isMobile && (
          <div>
            SIGN UP FOR BLACKSTAR NEWS,<br></br>OUR MONTHLY NEWSLETTER
            <Newsletter isFestival={isFestival}/>
          </div>
        )}
      </div>
      <Link className={styles.logoContainer} href='/'>
        <svg
          viewBox='0 0 1694 278'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            d='M0 4.46094H101.076C153.844 4.46094 180.971 22.1121 180.971 66.3329V76.9236C180.971 103.865 164.541 132.069 141.791 132.069V136.907C166.567 136.907 186.173 157.562 186.173 191.192V202.711C186.173 251.949 154.959 272.759 99.5897 272.759H0V4.46094ZM92.9008 108.51C105.164 108.51 109.623 104.608 109.623 88.6291V81.197C109.623 65.5897 105.164 62.0595 92.9008 62.0595H76.1787V108.51H92.9008ZM90.857 215.16C107.765 215.16 109.995 211.816 109.995 193.607V187.661C109.995 169.453 107.765 166.108 90.857 166.108H76.1787V215.16H90.857Z'
            fill='currentColor'
          />
          <path
            d='M753.717 4.46094H829.895V112.598H834.732L866.498 4.46094H945.278L900.872 135.637L947.879 272.759H866.498L834.732 159.791H829.895V272.759H753.717V4.46094Z'
            fill='currentColor'
          />
          <path
            d='M398.271 4.46094H513.654L558.246 272.759H480.21L474.821 227.237H437.289L431.715 272.759H353.679L398.271 4.46094ZM467.389 165.923C467.389 165.923 458.573 114.574 458.573 73.765H453.735C453.735 114.566 444.721 165.923 444.721 165.923H467.389Z'
            fill='currentColor'
          />
          <path
            d='M1338.52 4.46094H1453.9L1498.5 272.759H1420.46L1415.07 227.237H1377.54L1371.97 272.759H1293.93L1338.52 4.46094ZM1407.64 165.923C1407.64 165.923 1398.82 114.574 1398.82 73.765H1393.99C1393.99 114.566 1384.97 165.923 1384.97 165.923H1407.64Z'
            fill='currentColor'
          />
          <path
            d='M1507.83 4.63281H1612.81C1665.57 4.63281 1694 22.284 1694 66.5048V77.0955C1694 104.037 1677.53 133.019 1654.99 133.019V137.856C1681.67 137.856 1694 159.936 1694 191.363V272.93H1617.82V187.833C1617.82 169.625 1615.59 166.28 1598.68 166.28H1584.01V272.93H1507.83V4.63281ZM1602.77 108.682C1615.03 108.682 1617.64 104.78 1617.64 88.801V81.3689C1617.64 65.7616 1615.03 62.2313 1602.77 62.2313H1584.01V108.682H1602.77Z'
            fill='currentColor'
          />
          <path
            d='M195.507 4.46094H271.686V211.444H344.334V272.759H195.507V4.46094Z'
            fill='currentColor'
          />
          <path
            d='M558.186 206.24V70.9762C558.186 18.9518 586.427 0 651.272 0C716.117 0 744.359 18.9518 744.359 70.9762V108.137H668.18V79.3373C668.18 64.1016 662.42 59.4565 651.272 59.4565C640.124 59.4565 634.364 64.1016 634.364 79.3373V197.879C634.364 213.115 640.124 217.76 651.272 217.76C662.42 217.76 668.18 213.115 668.18 197.879V169.08H744.359V206.24C744.359 258.264 716.117 277.216 651.272 277.216C586.427 277.216 558.186 258.264 558.186 206.24Z'
            fill='currentColor'
          />
          <path
            d='M938.936 193.42V175.211H1013.07V200.852C1013.07 211.814 1019.02 217.76 1032.02 217.76C1042.24 217.76 1048.93 212.186 1048.93 201.966V200.666C1048.93 191.933 1045.77 187.102 1031.09 178.555L977.211 146.783C949.712 130.619 939.865 110.366 939.865 75.0639V73.2059C939.865 28.9851 963.09 0 1032.02 0C1100.58 0 1122.14 26.198 1122.14 81.3811V94.9447H1049.86V75.9929C1049.86 64.659 1043.54 59.4565 1032.77 59.4565C1023.29 59.4565 1015.86 64.2874 1015.86 73.2059V74.6923C1015.86 81.0095 1019.02 85.0972 1034.44 93.8298L1082.56 120.957C1116.56 140.094 1125.11 161.09 1125.11 192.676V196.207C1125.11 246.745 1102.26 277.216 1031.84 277.216C961.046 277.216 938.936 250.832 938.936 193.42Z'
            fill='currentColor'
          />
          <path
            d='M1186.83 65.7755H1129.05V4.46094H1320.8V65.7755H1263.01V272.759H1186.83V65.7755Z'
            fill='currentColor'
          />
        </svg>
      </Link>
      {isMobile && (
        <div className={styles.mobileNewsletter}>
          SIGN UP FOR BLACKSTAR NEWS,<br></br>OUR MONTHLY NEWSLETTER
          <Newsletter isFestival={isFestival} />
        </div>
      )}
      {mobileBottom ? (
        <div className={styles.mobileFooterBottom}>
          <div className={styles.footerBottomGroup}>
            <Link href='/'>Archive</Link>
            <Link href='/'>Press</Link>
            <Link href='/'>Contact</Link>
          </div>
          <div className={styles.footerBottomGroup}>
            <Link href='/'>Opportunities</Link>
            <Link href='/'>Submissions</Link>
          </div>
          <div className={styles.footerBottomGroup}>
            <Link href='/'>Privacy Policy</Link>
            <Link href='/'>Accessibility</Link>
            <div>C {new Date().getFullYear()} Blackstar</div>
          </div>
        </div>
      ) : (
        <div className={styles.footerBottom}>
          <Link href='/'>Archive</Link>
          <Link href='/'>Press</Link>
          <Link href='/'>Contact</Link>
          <Link href='/'>Opportunities</Link>
          <Link href='/'>Submissions</Link>
          <Link href='/'>Privacy Policy</Link>
          <Link href='/'>Accessibility</Link>
          <div>C {new Date().getFullYear()} Blackstar</div>
        </div>
      )}
    </div>
  )
}
