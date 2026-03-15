import routes from '@/routes/routes'
import { useLocation } from 'react-router-dom'
import styles from './AuthLayoutHeader.module.scss'

function AuthLayoutHeader() {
  const location = useLocation()
  const currentRoute = routes.find((route) => route.path === location.pathname)
  const routeName = currentRoute ? currentRoute.name : ''

  return (
    <header>
      <h2 className={styles.title}>{routeName}</h2>
    </header>
  )
}

export default AuthLayoutHeader
