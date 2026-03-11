import Logo from '../Logo/Logo'
import styles from './SideBar.module.scss'

function SideBar() {
  return (
    <nav className={styles.nav}>
      <Logo />
    </nav>
  )
}

export default SideBar
