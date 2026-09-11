import type { LabelColor } from '../types/taskLabel'
import { Constants } from '@/shared/types/database.ts'

export const TASK_LABEL_COLORS = Constants.public.Enums.label_color

export const TASK_LABEL_COLOR_CLASSES = {
  red: 'bg-red-100 text-red-800',
  orange: 'bg-orange-100 text-orange-800',
  yellow: 'bg-yellow-100 text-yellow-800',
  green: 'bg-green-100 text-green-800',
  blue: 'bg-blue-100 text-blue-800',
  purple: 'bg-purple-100 text-purple-800',
} satisfies Record<LabelColor, string>
