import { Outlet } from 'react-router-dom'
import styles from './AppLayout.module.scss'
import SideBar from './components/SideBar/Sidebar'

export default function AppLayout() {
  return (
    <section className={styles.section}>
      <SideBar />

      <main className={styles.main}>
        <Outlet />
      </main>
    </section>
  )
}
