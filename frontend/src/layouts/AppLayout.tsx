import { Outlet } from 'react-router-dom'
import styles from './AppLayout.module.scss'

export default function AppLayout() {
  return (
    <section className={styles.section}>
      <nav className={styles.nav}>MedFlow</nav>

      <main className={styles.main}>
        <Outlet />
      </main>
    </section>
  )
}
