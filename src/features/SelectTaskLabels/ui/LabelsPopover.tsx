import { Input } from '@/shared/ui/Input'
import { Label } from '@/shared/ui/Label'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/Popover'
import { Button } from '@/shared/ui/Button'
import {
  type LabelColor,
  type TaskLabel,
  TaskLabelBadge,
  TASK_LABEL_COLORS,
  TASK_LABEL_COLOR_CLASSES,
} from '@/entities/TaskLabel'
import type { TaskLabelsFieldProps } from '@/entities/Task'
import { type ChangeEvent, type KeyboardEvent, useEffect, useState } from 'react'
import { useCreateTaskLabelMutation } from '../api/createTaskLabelApi.ts'

interface LabelsPopoverProps extends TaskLabelsFieldProps {
  boardId: string
  availableLabels: TaskLabel[]
}

const DEFAULT_LABEL_COLOR: LabelColor = 'blue'

const LabelsPopover = (props: LabelsPopoverProps) => {
  const {
    boardId,
    availableLabels,
    selectedLabelIds,
    onSelectedLabelIdsChange,
    disabled,
    onBusyChange,
  } = props
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [color, setColor] = useState<LabelColor>(DEFAULT_LABEL_COLOR)
  const [
    createTaskLabel,
    { isLoading: isCreatingLabel, isError: isCreateLabelError, reset: resetCreateLabel },
  ] = useCreateTaskLabelMutation()

  const isDisabled = disabled || isCreatingLabel

  useEffect(() => {
    onBusyChange(isCreatingLabel)
  }, [isCreatingLabel, onBusyChange])

  const labelName = search.trim()
  const normalizedSearch = labelName.toLowerCase()

  const filteredLabels = availableLabels
    .filter((label) => label.name.toLowerCase().includes(normalizedSearch))
    .sort((a, b) => a.name.localeCompare(b.name))

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value)

    if (isCreateLabelError) {
      resetCreateLabel()
    }
  }

  const toggleLabelSelection = (labelId: string) => {
    if (isDisabled) return

    const isSelected = selectedLabelIds.includes(labelId)
    const nextSelectedLabelIds = isSelected
      ? selectedLabelIds.filter((id) => id !== labelId)
      : [...selectedLabelIds, labelId]

    onSelectedLabelIdsChange(nextSelectedLabelIds)
  }

  const selectedLabels = availableLabels.filter((label) => selectedLabelIds.includes(label.id))

  const hasExactMatch = availableLabels.some(
    (label) => label.name.toLowerCase() === normalizedSearch,
  )

  const canCreate = labelName.length > 0 && !hasExactMatch

  const resetLabelDraft = () => {
    setSearch('')
    setColor(DEFAULT_LABEL_COLOR)
  }

  const handleCreateLabel = async () => {
    if (!canCreate || isDisabled) return

    try {
      const createdLabel = await createTaskLabel({
        boardId,
        name: labelName,
        color,
      }).unwrap()

      onSelectedLabelIdsChange([...selectedLabelIds, createdLabel.id])
      resetLabelDraft()
    } catch (caughtError) {
      console.error(caughtError)
    }
  }

  const handleSearchKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') return

    event.preventDefault()

    if (canCreate) {
      void handleCreateLabel()
    }
  }

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen && isCreatingLabel) return

    setOpen(nextOpen)

    if (!nextOpen) {
      resetLabelDraft()
      resetCreateLabel()
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-1">
      {selectedLabels.map((label) => (
        <TaskLabelBadge
          key={label.id}
          label={label}
          onRemove={() => toggleLabelSelection(label.id)}
          disabled={isDisabled}
        />
      ))}

      <Popover open={open} onOpenChange={handleOpenChange}>
        <PopoverTrigger
          render={
            <Button variant="ghost" type="button" disabled={isDisabled}>
              Add
            </Button>
          }
        />
        <PopoverContent className="w-80">
          <div className="grid gap-4">
            <div className="space-y-2">
              <h4 className="leading-none font-medium">Labels</h4>
            </div>
            <div className="grid gap-2">
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="label-search">Search</Label>
                <Input
                  disabled={isDisabled}
                  id="label-search"
                  className="col-span-2 h-8"
                  maxLength={30}
                  placeholder="Search or create label..."
                  value={search}
                  onChange={handleSearchChange}
                  onKeyDown={handleSearchKeyDown}
                />
              </div>

              {filteredLabels.map((label) => {
                const isSelected = selectedLabelIds.includes(label.id)

                return (
                  <Button
                    key={label.id}
                    type="button"
                    variant={isSelected ? 'secondary' : 'ghost'}
                    onClick={() => toggleLabelSelection(label.id)}
                    aria-pressed={isSelected}
                    disabled={isDisabled}
                  >
                    <span
                      className={`size-3 rounded-full ${TASK_LABEL_COLOR_CLASSES[label.color]}`}
                    />
                    {label.name}
                  </Button>
                )
              })}

              {canCreate && (
                <>
                  <div className="flex gap-2">
                    {TASK_LABEL_COLORS.map((labelColor) => (
                      <Button
                        key={labelColor}
                        type="button"
                        aria-label={`Select ${labelColor} color`}
                        aria-pressed={color === labelColor}
                        disabled={isDisabled}
                        className={`size-6 rounded-full p-0 ${
                          TASK_LABEL_COLOR_CLASSES[labelColor]
                        } ${color === labelColor ? 'ring-2 ring-black' : ''}`}
                        onClick={() => setColor(labelColor)}
                      />
                    ))}
                  </div>

                  <Button
                    type="button"
                    disabled={isDisabled}
                    onClick={() => void handleCreateLabel()}
                  >
                    {isCreatingLabel ? 'Creating...' : `Create "${labelName}"`}
                  </Button>
                </>
              )}

              {!availableLabels.length && !normalizedSearch && (
                <p>No labels yet. Enter a name to create one.</p>
              )}

              {isCreateLabelError && (
                <p role="alert" className="text-destructive text-sm">
                  Failed to create label. Please try again.
                </p>
              )}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}

export default LabelsPopover
