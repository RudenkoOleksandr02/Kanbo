import type { TaskLabel } from '../../model/types/taskLabel.ts'
import { TASK_LABEL_COLOR_CLASSES } from '../../model/const/taskLabelColors.ts'
import { Button } from '@/shared/ui/Button'

interface TaskLabelBadgeProps {
  label: TaskLabel
  onRemove?: () => void
  disabled?: boolean
}

const TaskLabelBadge = (props: TaskLabelBadgeProps) => {
  const { label, onRemove, disabled } = props

  return (
    <div
      className={`${TASK_LABEL_COLOR_CLASSES[label.color]} inline-flex items-center gap-1 rounded px-2`}
    >
      <span>{label.name}</span>
      {onRemove && (
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          onClick={onRemove}
          disabled={disabled}
          aria-label={`Remove label ${label.name}`}
        >
          ×
        </Button>
      )}
    </div>
  )
}

export default TaskLabelBadge
