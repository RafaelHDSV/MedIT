import { ClockCountdownIcon } from '@phosphor-icons/react'
import styles from './AttendanceHourlyChart.module.scss'

function generateAttendanceData() {
  const data = []
  for (let i = 0; i <= 12; i++) {
    data.push({
      hour: `${i}h`,
      value: Math.floor(Math.random() * 200)
    })
  }
  return data
}

function AttendanceHourlyChart() {
  const attendanceData: { hour: string; value: number }[] =
    generateAttendanceData()

  return (
    <div className={styles.section}>
      <div className={styles.header}>
        <h3>Atendimentos por Hora</h3>

        <div className={styles.asideInfo}>
          <ClockCountdownIcon size={22} />
          <span>30 p/ hora</span>
        </div>
      </div>

      <div className={styles.chart}>
        {attendanceData.map((item, index) => (
          <div key={index} className={styles.barContainer}>
            <div className={styles.bar} style={{ height: `${item.value}px` }} />
            <span className={styles.label}>{item.hour}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AttendanceHourlyChart
