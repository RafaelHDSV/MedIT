import UnauthImage3 from '@/assets/unauth-image-3.svg'
import UnauthImage from '@/assets/unauth-image.svg'
import Logo from '@/components/Logo/Logo'
import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import styles from './UnauthLayout.module.scss'

export default function UnauthLayout() {
  const [imageIndex, setImageIndex] = useState(0)
  const imageSource = [UnauthImage, '/SignIn.png', UnauthImage3]

  function handleImageClick() {
    setImageIndex((imageIndex + 1) % imageSource.length)
  }

  return (
    <div className={styles.content}>
      <aside className={styles.form}>
        <Logo />

        <Outlet />
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
