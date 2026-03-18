import UnauthImage3 from '@/assets/unauth-image-3.svg'
import UnauthImage from '@/assets/unauth-image.svg'
import AuthLayoutHeader from '@/components/AuthLayoutHeader/AuthLayoutHeader'
import Logo from '@/components/Logo/Logo'
import routes from '@/routes/routes'
import { useState } from 'react'
import { matchPath, Outlet, useLocation } from 'react-router-dom'
import styles from './UnauthLayout.module.scss'

export default function UnauthLayout() {
  const location = useLocation()
  const currentRoute = routes.find((route) =>
    matchPath({ path: route.path, end: true }, location.pathname)
  )
  const isSignInPage = currentRoute?.path === '/'
  const [imageIndex, setImageIndex] = useState(0)
  const imageSource = [UnauthImage, '/SignIn.png', UnauthImage3]

  function handleImageClick() {
    setImageIndex((imageIndex + 1) % imageSource.length)
  }

  return (
    <div className={styles.content}>
      <aside
        className={styles.form}
        style={{ justifyContent: isSignInPage ? 'center' : 'flex-end' }}
      >
        <Logo className={styles.logo} />

        <div className={styles.formContent}>
          <AuthLayoutHeader type='unauth' />
          <Outlet />
        </div>
      </aside>

      <aside className={styles.image}>
        <img
          src={imageSource[imageIndex]}
          alt='Ilustração MedFlow'
          onClick={handleImageClick}
        />
        <h3>Plataforma de Apoio à Triagem e Fluxo Hospitalar</h3>
      </aside>
    </div>
  )
}
