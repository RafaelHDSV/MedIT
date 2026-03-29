import DashboardCard from '@/components/DashboardCard/DashboardCard'
import { ClockCountdownIcon } from '@phosphor-icons/react'
import { Tooltip } from 'antd'
import styles from './AttendanceByTimeChart.module.scss'

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

function AttendanceByTimeChart() {
  const attendanceData: { hour: string; value: number }[] =
    generateAttendanceData()

  return (
    <DashboardCard
      title='Atendimentos por Hora'
      icon={ClockCountdownIcon}
      asideText='30 p/ hora'
      gridArea='attendanceByTimeChart'
    >
      <div className={styles.chart}>
        {attendanceData.map((item, index) => (
          <div key={index} className={styles.barContainer}>
            <Tooltip title={`${item.value} atendimentos às ${item.hour}`}>
              <div
                className={styles.bar}
                style={{ height: `${item.value}px` }}
              />
            </Tooltip>
            <span className={styles.label}>{item.hour}</span>
          </div>
        ))}
      </div>
    </DashboardCard>
  )
}

export default AttendanceByTimeChart
