import styles from './AttendanceByHourChart.module.scss'

function AttendanceByHourChart({ className }: { className?: string }) {
  return (
    <section className={`${styles.container} ${className}`}>
      AttendanceByHourChart
    </section>
  )
}

export default AttendanceByHourChart
