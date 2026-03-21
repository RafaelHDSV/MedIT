import UnauthImage3 from '@/assets/unauth-image-3.svg'
import UnauthImage from '@/assets/unauth-image.svg'
import AuthLayoutHeader from '@/components/AuthLayoutHeader/AuthLayoutHeader'
import Logo from '@/components/Logo/Logo'
import routes from '@/routes/routes'
import { useState } from 'react'
import { matchPath, Outlet, useLocation } from 'react-router-dom'
import TypewriterComponent from 'typewriter-effect'
import styles from './UnauthLayout.module.scss'

export default function UnauthLayout() {
  const location = useLocation()
  const currentRoute = routes.find((route) =>
    matchPath({ path: route.path, end: true }, location.pathname)
  )
  const isSignInPage = currentRoute?.path === '/'
  const [imageIndex, setImageIndex] = useState(0)
  const imageSource = [
    UnauthImage,
    UnauthImage3,
    '/image1.png',
    '/image2.png',
    '/image3.png',
    '/image4.png',
    '/image5.png'
    // TODO: Gerar as imagens restantes pela IA e adicionar
    // '/image6.png',
    // '/image7.png',
    // '/image8.png'
  ]

  setTimeout(() => {
    setImageIndex((imageIndex + 1) % imageSource.length)
  }, 7000)

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

        <div className={styles.typewriter}>
          <TypewriterComponent
            options={{
              autoStart: true,
              loop: true,
              delay: 60,
              deleteSpeed: 30,
              skipAddStyles: true,
              wrapperClassName: styles.typewriter,
              strings: [
                'Plataforma de Apoio à Triagem e Fluxo Hospitalar',
                'Agilize a triagem de pacientes e otimize o fluxo hospitalar',
                'Tome decisões informadas com base em dados clínicos',
                'Melhore a eficiência e a qualidade do atendimento hospitalar',
                'Facilite a comunicação entre equipes de saúde',
                'Acesse informações clínicas em tempo real para uma triagem precisa',
                'Reduza o tempo de espera e melhore a experiência do paciente'
              ]
            }}
          />
        </div>
      </aside>
    </div>
  )
}
