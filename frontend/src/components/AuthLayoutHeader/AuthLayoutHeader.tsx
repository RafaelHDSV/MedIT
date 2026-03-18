import routes from '@/routes/routes'
import { ArrowLeftIcon } from '@phosphor-icons/react'
import { matchPath, useLocation } from 'react-router-dom'
import styles from './AuthLayoutHeader.module.scss'

interface IAuthLayoutHeaderProps {
  type?: 'unauth'
  marginBottom?: number
}

function AuthLayoutHeader({ type, marginBottom = 16 }: IAuthLayoutHeaderProps) {
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
      {canGoBack && (
        <button className={styles.backButton} onClick={handleGoBack}>
          <ArrowLeftIcon size={28} />
        </button>
      )}

      <div className={styles.textContainer}>
        <h2 className={titleStyles()}>{routeName}</h2>
        <p className={descriptionStyles()}>{routeDescription}</p>
      </div>
    </header>
  )
}

export default AuthLayoutHeader
