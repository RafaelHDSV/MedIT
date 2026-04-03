import SideBar from '@/components/SideBar/SideBar'
import { useIsMobile } from '@/hooks/useIsMobile'
import { ListIcon } from '@phosphor-icons/react'
import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import styles from './AuthLayout.module.scss'

export default function AuthLayout() {
  const isMobile = useIsMobile()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const effectiveMobileOpen = isMobile && mobileMenuOpen

  useEffect(() => {
    if (!isMobile || !mobileMenuOpen) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [isMobile, mobileMenuOpen])

  return (
    <section className={styles.section}>
      {isMobile && effectiveMobileOpen && (
        <button
          type='button'
          className={styles.backdrop}
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {isMobile && !effectiveMobileOpen && (
        <button
          type='button'
          className={styles.menuFab}
          onClick={() => setMobileMenuOpen(true)}
        >
          <ListIcon size={28} />
        </button>
      )}

      <SideBar
        isMobile={isMobile}
        mobileOpen={effectiveMobileOpen}
        onMobileOpenChange={setMobileMenuOpen}
      />

      <main className={styles.main}>
        <Outlet />
      </main>
    </section>
  )
}
