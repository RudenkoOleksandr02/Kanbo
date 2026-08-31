import type { Tables } from '@/shared/types/database.ts'

type TaskRow = Tables<'tasks'>

export const reorderTasks = (
  tasks: readonly TaskRow[],
  movedTaskId: TaskRow['id'],
  newPosition: TaskRow['position'],
): TaskRow[] => {
  const movedTaskIndex = tasks.findIndex((task) => task.id === movedTaskId)

  if (movedTaskIndex === -1) return [...tasks]
  if (newPosition < 0) throw new RangeError('The position cannot be less than zero.')
  if (newPosition > tasks.length - 1)
    throw new RangeError(`Position must not exceed ${tasks.length - 1}`)

  const reorderedTasks = [...tasks]

  const [movedTask] = reorderedTasks.splice(movedTaskIndex, 1)
  reorderedTasks.splice(newPosition, 0, movedTask)

  return reorderedTasks.map((task, index) => {
    return { ...task, position: index }
  })
}
