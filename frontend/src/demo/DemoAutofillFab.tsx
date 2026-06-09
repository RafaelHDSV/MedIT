import Button from '@/components/Button/Button'
import { ROUTES } from '@/routes/constants'
import { LightningIcon } from '@phosphor-icons/react'
import { Select, Tooltip, message } from 'antd'
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import {
  DEMO_LOGIN_PERSONAS,
  type DemoLoginPersona
} from './presentationData'
import { useDemoAutofillContext } from './DemoAutofillContext'
import styles from './DemoAutofillFab.module.scss'

const HOTKEY_LABEL = 'Ctrl+Shift+D'

function DemoAutofillFab() {
  const context = useDemoAutofillContext()
  const location = useLocation()

  const isSignIn = location.pathname === ROUTES.SIGNIN.path

  useEffect(() => {
    if (!context?.enabled) return

    function onKeyDown(event: KeyboardEvent) {
      if (!event.ctrlKey || !event.shiftKey || event.key.toLowerCase() !== 'd') {
        return
      }

      const target = event.target
      if (
        target instanceof HTMLElement &&
        (target.isContentEditable ||
          target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT')
      ) {
        return
      }

      event.preventDefault()
      void context.triggerAutofill().then((filled) => {
        if (filled) {
          message.success('Campos preenchidos com dados da demo TCC')
        } else {
          message.info('Nenhum formulario ativo para preencher nesta tela')
        }
      })
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [context])

  if (!context?.enabled) return null

  return (
    <div className={styles.fabRoot}>
      {isSignIn && (
        <Select<DemoLoginPersona>
          className={styles.personaSelect}
          size='small'
          value={context.loginPersona}
          options={DEMO_LOGIN_PERSONAS.map((item) => ({
            value: item.value,
            label: item.label
          }))}
          onChange={context.setLoginPersona}
          popupMatchSelectWidth={false}
        />
      )}

      <Tooltip title={`Preencher formulario da demo (${HOTKEY_LABEL})`}>
        <Button
          htmlType='button'
          className={styles.fabButton}
          onClick={() => {
            void context.triggerAutofill().then((filled) => {
              if (filled) {
                message.success('Campos preenchidos com dados da demo TCC')
              } else {
                message.info('Nenhum formulario ativo para preencher nesta tela')
              }
            })
          }}
        >
          <LightningIcon size={18} weight='fill' />
          <span className={styles.fabLabel}>Demo</span>
        </Button>
      </Tooltip>
    </div>
  )
}

export default DemoAutofillFab
