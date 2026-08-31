import { DialogClose, DialogFooter, DialogHeader, DialogTitle } from '@/shared/ui/Dialog'
import { Field, FieldGroup } from '@/shared/ui/Field'
import { Label } from '@/shared/ui/Label'
import { Input } from '@/shared/ui/Input'
import { Button } from '@/shared/ui/Button'
import { type UseFormReturn } from 'react-hook-form'
import type { TaskFormValues } from '../../model/schema/taskFormSchema'

interface TaskFormProps {
  form: UseFormReturn<TaskFormValues>
  onSubmit: (data: TaskFormValues) => Promise<void>
  isError: boolean
  isLoading: boolean
  dialogTitle: string
  errorMessage: string
}

const TaskForm = (props: TaskFormProps) => {
  const { form, onSubmit, isError, isLoading, dialogTitle, errorMessage } = props

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <DialogHeader>
        <DialogTitle>{dialogTitle}</DialogTitle>
      </DialogHeader>
      <FieldGroup>
        <Field>
          <Label htmlFor="title">Title</Label>
          <Input id="title" {...form.register('title')} />

          {form.formState.errors.title && <p role="alert">{form.formState.errors.title.message}</p>}
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
          {errorMessage}
        </p>
      )}

      <DialogFooter>
        <DialogClose
          render={
            <Button variant="outline" type="button" disabled={isLoading}>
              Cancel
            </Button>
          }
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save'}
        </Button>
      </DialogFooter>
    </form>
  )
}

export default TaskForm
