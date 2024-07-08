import Image from 'next/image'
import styles from '../styles/page.module.css'

export default function Home() {  
  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <h1>
          Olá Ad Toyama
        </h1>        
      </div>
    </main>
  )
}
