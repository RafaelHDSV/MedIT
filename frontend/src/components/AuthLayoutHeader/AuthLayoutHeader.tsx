import { useAuth } from '@/hooks/useAuth'
import routes from '@/routes/routes'
import { ArrowLeftIcon } from '@phosphor-icons/react'
import { matchPath, useLocation } from 'react-router-dom'
import styles from './AuthLayoutHeader.module.scss'

interface IAuthLayoutHeaderProps {
  type?: 'unauth'
  marginBottom?: number
  actionComponent?: React.ReactNode
}

function AuthLayoutHeader({
  type,
  marginBottom = 16,
  actionComponent
}: IAuthLayoutHeaderProps) {
  const { user } = useAuth()
  const { unitId } = user || {}
  const location = useLocation()
  const currentRoute = routes(unitId).find((route) =>
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

  const titleStyles = () => {
    switch (type) {
      case 'unauth':
        return styles.unauthTitle
      default:
        return styles.title
    }
  }

  const descriptionStyles = () => {
    switch (type) {
      case 'unauth':
        return styles.unauthDescription
      default:
        return styles.description
    }
  }

  return (
    <header className={styles.header} style={{ marginBottom }}>
      <div className={styles.textContainer}>
        <div className={styles.titleContainer}>
          {canGoBack && (
            <button className={styles.backButton} onClick={handleGoBack}>
              <ArrowLeftIcon size={28} />
            </button>
          )}
          <h2 className={titleStyles()}>{routeName}</h2>
        </div>

        <p className={descriptionStyles()}>{routeDescription}</p>
      </div>

      {actionComponent && actionComponent}
    </header>
  )
}

export default AuthLayoutHeader
