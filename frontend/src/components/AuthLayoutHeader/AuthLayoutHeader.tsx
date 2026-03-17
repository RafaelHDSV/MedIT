import routes from '@/routes/routes'
import { ArrowLeftIcon } from '@phosphor-icons/react'
import { matchPath, useLocation } from 'react-router-dom'
import styles from './AuthLayoutHeader.module.scss'

interface IAuthLayoutHeaderProps {
  marginBottom?: number
}

function AuthLayoutHeader({ marginBottom = 16 }: IAuthLayoutHeaderProps) {
  const location = useLocation()
  const currentRoute = routes.find((route) =>
    matchPath({ path: route.path, end: true }, location.pathname)
  )
  const {
    name: routeName,
    description: routeDescription,
    meta
  } = currentRoute ?? {}
  const { canGoBack } = meta ?? {}

  function handleGoBack() {
    window.history.back()
  }

  return (
    <header className={styles.header} style={{ marginBottom }}>
      {canGoBack && (
        <button className={styles.backButton} onClick={handleGoBack}>
          <ArrowLeftIcon size={28} />
        </button>
      )}

      <div className={styles.textContainer}>
        <h2 className={styles.title}>{routeName}</h2>
        <p className={styles.description}>{routeDescription}</p>
      </div>
    </header>
  )
}

export default AuthLayoutHeader
