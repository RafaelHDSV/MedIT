import routes from '@/routes/routes'
import { matchPath, useLocation } from 'react-router-dom'
import styles from './AuthLayoutHeader.module.scss'

interface IAuthLayoutHeaderProps {
  marginBottom?: number
}

function AuthLayoutHeader({ marginBottom = 32 }: IAuthLayoutHeaderProps) {
  const location = useLocation()
  const currentRoute = routes.find((route) =>
    matchPath({ path: route.path, end: true }, location.pathname)
  )
  const routeName = currentRoute?.name ?? ''

  return (
    <header style={{ marginBottom }}>
      <h2 className={styles.title}>{routeName}</h2>
    </header>
  )
}

export default AuthLayoutHeader
