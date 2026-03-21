import UnauthImage3 from '@/assets/unauth-image-3.svg'
import UnauthImage from '@/assets/unauth-image.svg'
import AuthLayoutHeader from '@/components/AuthLayoutHeader/AuthLayoutHeader'
import Logo from '@/components/Logo/Logo'
import routes from '@/routes/routes'
import { useCallback, useEffect, useState } from 'react'
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
  const [isFading, setIsFading] = useState(false)

  const texts = [
    'Plataforma de Apoio à Triagem e Fluxo Hospitalar',
    'Agilize a triagem de pacientes e otimize o fluxo',
    'Tome decisões informadas com base em dados clínicos',
    'Melhore a eficiência e a qualidade do atendimento',
    'Facilite a comunicação entre equipes de saúde',
    'Acesse todas as informações clínicas em tempo real',
    'Reduza o tempo de espera e melhore a experiência',
    'Aumente a segurança do paciente com alertas inteligentes'
  ]

  const imageSource = useCallback(
    () => [
      UnauthImage,
      UnauthImage3,
      '/image1.png',
      '/image2.png',
      '/image3.png',
      '/image4.png',
      '/image5.png',
      '/image6.png'
    ],
    []
  )()

  function handleImageChange(index: number) {
    if (index === imageIndex) return

    setIsFading(true)

    setTimeout(() => {
      setImageIndex(index)
      setIsFading(false)
    }, 200)
  }

  useEffect(() => {
    imageSource.forEach((src) => {
      const img = new Image()
      img.src = src
    })
  }, [imageSource])

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
          className={`${styles.imageItem} ${isFading ? styles.fade : ''}`}
        />

        <div className={styles.typewriter}>
          <TypewriterComponent
            options={{
              autoStart: true,
              loop: true,
              delay: 60,
              deleteSpeed: 30,
              skipAddStyles: true,
              wrapperClassName: styles.typewriter
            }}
            onInit={(typewriter) => {
              texts.forEach((text, index) => {
                typewriter
                  .callFunction(() => {
                    handleImageChange(index)
                  })
                  .typeString(text)
                  .pauseFor(1800)
                  .deleteAll()
              })

              typewriter.start()
            }}
          />
        </div>
      </aside>
    </div>
  )
}
