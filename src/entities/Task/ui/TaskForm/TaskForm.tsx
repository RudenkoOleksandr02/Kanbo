import { DialogClose, DialogFooter, DialogHeader, DialogTitle } from '@/shared/ui/Dialog'
import { Field, FieldGroup } from '@/shared/ui/Field'
import { Label } from '@/shared/ui/Label'
import { Input } from '@/shared/ui/Input'
import { Button } from '@/shared/ui/Button'
import { Controller, type UseFormReturn } from 'react-hook-form'
import type { TaskFormValues } from '../../model/schema/taskFormSchema'
import type { ReactNode } from 'react'

export interface TaskLabelsFieldProps {
  selectedLabelIds: string[]
  onSelectedLabelIdsChange: (labelIds: string[]) => void
  disabled?: boolean
  onBusyChange: (isBusy: boolean) => void
}

export type RenderTaskLabelsField = (props: TaskLabelsFieldProps) => ReactNode

interface TaskFormProps {
  form: UseFormReturn<TaskFormValues>
  onSubmit: (data: TaskFormValues) => Promise<void>
  isError: boolean
  isSubmitting: boolean
  isBusy: boolean
  dialogTitle: string
  errorMessage: string
  renderLabelsField: RenderTaskLabelsField
  onLabelsBusyChange: (isBusy: boolean) => void
}

const TaskForm = (props: TaskFormProps) => {
  const {
    form,
    onSubmit,
    isError,
    isSubmitting,
    isBusy,
    dialogTitle,
    errorMessage,
    renderLabelsField,
    onLabelsBusyChange,
  } = props

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

        <Field>
          <Label htmlFor="dueDate">Due date</Label>
          <Input id="dueDate" type="date" {...form.register('dueDate')} />

          {form.formState.errors.dueDate && (
            <p role="alert">{form.formState.errors.dueDate.message}</p>
          )}
        </Field>

        <Field>
          <p className="text-sm font-medium">Labels</p>

          <Controller
            control={form.control}
            name="labelIds"
            render={({ field }) => (
              <>
                {renderLabelsField({
                  selectedLabelIds: field.value,
                  onSelectedLabelIdsChange: field.onChange,
                  disabled: isBusy,
                  onBusyChange: onLabelsBusyChange,
                })}
              </>
            )}
          />
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
            <Button variant="outline" type="button" disabled={isBusy}>
              Cancel
            </Button>
          }
        />
        <Button type="submit" disabled={isBusy}>
          {isSubmitting ? 'Saving...' : 'Save'}
        </Button>
      </DialogFooter>
    </form>
  )
}

export default TaskForm
