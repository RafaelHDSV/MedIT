import { useEffect, useState } from 'react'

export interface DevTask {
  id: string
  title: string
  done: boolean
}

const STORAGE_KEY = 'devTasks'

export function useDevTasks() {
  const [tasks, setTasks] = useState<DevTask[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
  }, [tasks])

  function addTask(title: string) {
    setTasks((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        title,
        done: false
      }
    ])
  }

  function toggleTask(id: string) {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, done: !task.done } : task
      )
    )
  }

  function removeTask(id: string) {
    setTasks((prev) => prev.filter((task) => task.id !== id))
  }

  return {
    tasks,
    addTask,
    toggleTask,
    removeTask
  }
}
