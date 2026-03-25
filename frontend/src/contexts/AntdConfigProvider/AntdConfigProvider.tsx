import { EmptyIcon } from '@phosphor-icons/react'
import { theme as antdTheme, ConfigProvider, Flex } from 'antd'

function renderEmpty() {
  return (
    <Flex vertical align='center' justify='center' gap={8}>
      <EmptyIcon size={32} />
      <span>Nenhuma informação encontrada para essa consulta</span>
    </Flex>
  )
}

function AntdConfigProvider({ children }: { children: React.ReactNode }) {
  const primaryColor = getComputedStyle(document.documentElement)
    .getPropertyValue('--primary-color')
    .trim()

  return (
    <ConfigProvider
      theme={{
        algorithm: antdTheme.defaultAlgorithm,
        token: { colorPrimary: primaryColor }
      }}
      renderEmpty={renderEmpty}
      locale={{
        locale: 'pt-br',
        Pagination: {
          items_per_page: 'itens por página',
          jump_to: 'Ir para',
          jump_to_confirm: 'confirmar',
          page: 'Página',
          prev_page: 'Página anterior',
          next_page: 'Próxima página',
          prev_5: '5 páginas anteriores',
          next_5: 'Próximas 5 páginas',
          prev_3: '3 páginas anteriores',
          next_3: 'Próximas 3 páginas'
        },
        DatePicker: {
          lang: {
            locale: 'pt-br',
            today: 'Hoje',
            now: 'Agora',
            backToToday: 'Voltar para hoje',
            ok: 'OK',
            clear: 'Limpar',
            month: 'Mês',
            year: 'Ano',
            timeSelect: 'Selecionar horário',
            dateSelect: 'Selecionar data',
            weekSelect: 'Selecionar semana',
            monthSelect: 'Selecionar mês',
            yearSelect: 'Selecionar ano',
            decadeSelect: 'Selecionar década',
            yearFormat: 'YYYY',
            dateFormat: 'DD/MM/YYYY',
            dayFormat: 'D',
            dateTimeFormat: 'DD/MM/YYYY HH:mm:ss',
            week: 'Semana',
            previousMonth: 'Mês anterior',
            nextMonth: 'Próximo mês',
            previousYear: 'Ano anterior',
            nextYear: 'Próximo ano',
            monthBeforeYear: true,
            shortWeekDays: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
            shortMonths: [
              'Jan',
              'Fev',
              'Mar',
              'Abr',
              'Mai',
              'Jun',
              'Jul',
              'Ago',
              'Set',
              'Out',
              'Nov',
              'Dez'
            ],
            previousDecade: 'Década anterior',
            nextDecade: 'Próxima década',
            previousCentury: 'Século anterior',
            nextCentury: 'Próximo século',
            placeholder: 'Selecione a data'
          },
          timePickerLocale: {
            placeholder: 'Selecione a hora',
            rangePlaceholder: ['Hora inicial', 'Hora final']
          }
        }
      }}
    >
      {children}
    </ConfigProvider>
  )
}

export default AntdConfigProvider
