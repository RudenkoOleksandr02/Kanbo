import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/ui/AlertDialog'
import { useDeleteTaskMutation } from '../api/deleteTaskApi.ts'

const DeleteTask = ({ taskId, onClose }: { taskId: string | null; onClose: VoidFunction }) => {
  const [deleteTask, { isLoading, isError, reset: resetMutation }] = useDeleteTaskMutation()

  const handleClose = () => {
    resetMutation()
    onClose()
  }

  const handleDelete = async () => {
    try {
      if (taskId) {
        await deleteTask({ taskId }).unwrap()
        handleClose()
      }
    } catch (caughtError) {
      console.error(caughtError)
    }
  }

  return (
    <AlertDialog
      open={taskId !== null}
      onOpenChange={(open) => {
        if (!open && !isLoading) {
          handleClose()
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. It will permanently delete your task.
          </AlertDialogDescription>
        </AlertDialogHeader>
        {isError && (
          <p role="alert" className="text-destructive text-sm">
            Failed to delete task. Please try again.
          </p>
        )}
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction disabled={isLoading} onClick={() => void handleDelete()}>
            {isLoading ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default DeleteTask
