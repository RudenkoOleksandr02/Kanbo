import { Button } from '@/shared/ui/Button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui/Dialog'
import { Field, FieldGroup } from '@/shared/ui/Field'
import { Input } from '@/shared/ui/Input'
import { Label } from '@/shared/ui/Label'
import { useForm } from 'react-hook-form'
import { taskFormSchema, type TaskFormValues } from '@/entities/Task'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCreateTaskMutation } from '../api/createTaskApi.ts'
import { useState } from 'react'

const CreateTask = ({ columnId }: { columnId: string }) => {
  const [open, setOpen] = useState(false)

  const [createTask, { isLoading, isError, reset: resetMutation }] = useCreateTaskMutation()

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: '',
      description: '',
    },
  })

  const onCreateSubmit = async (data: TaskFormValues) => {
    try {
      await createTask({
        ...data,
        columnId,
      }).unwrap()

      form.reset()
      setOpen(false)
    } catch (caughtError) {
      console.error(caughtError)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen)

        if (!nextOpen) {
          form.reset()
          resetMutation()
        }
      }}
    >
      <DialogTrigger render={<Button variant="outline">Add Task</Button>} />
      <DialogContent className="sm:max-w-sm">
        <form onSubmit={form.handleSubmit(onCreateSubmit)}>
          <DialogHeader>
            <DialogTitle>Task creation form</DialogTitle>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <Label htmlFor="title">Title</Label>
              <Input id="title" {...form.register('title')} />

              {form.formState.errors.title && (
                <p role="alert">{form.formState.errors.title.message}</p>
              )}
            </Field>

            <Field>
              <Label htmlFor="description">Description</Label>
              <Input id="description" {...form.register('description')} />

              {form.formState.errors.description && (
                <p role="alert">{form.formState.errors.description.message}</p>
              )}
            </Field>
          </FieldGroup>

          {isError && (
            <p role="alert" className="text-destructive text-sm">
              Failed to create task. Please try again.
            </p>
          )}

          <DialogFooter>
            <DialogClose
              render={
                <Button variant="outline" type="button">
                  Cancel
                </Button>
              }
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default CreateTask
