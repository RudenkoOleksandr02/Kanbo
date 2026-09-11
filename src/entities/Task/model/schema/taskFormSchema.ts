import { z } from 'zod'

export const taskFormSchema = z.object({
  title: z.string().trim().min(1, 'Title is required'),
  description: z.string().trim(),
  dueDate: z.string().trim(),
  labelIds: z.array(z.string().uuid()),
})

export type TaskFormValues = z.infer<typeof taskFormSchema>
