import styles from './Empty.module.scss'

function Empty({
  message = 'Nenhuma informação encontrada para essa consulta'
}: {
  message?: string
}) {
  return (
    <div className={styles.container}>
      <img src='/no-data.svg' alt='No data' className={styles.image} />
      <span>{message}</span>
    </div>
  )
}

export default Empty
