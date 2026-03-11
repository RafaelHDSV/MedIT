import { ListIcon } from '@phosphor-icons/react'
import Logo from '../Logo/Logo'
import styles from './SideBar.module.scss'

function SideBar() {
  return (
    <nav className={styles.nav}>
      <header className={styles.header}>
        <ListIcon className={styles.icon} size={32} />
        <Logo fontSize={32} />
      </header>
      routes
    </nav>
  )
}

export default SideBar
