import { render, screen, waitFor } from '@testing-library/react'
import DeleteTask from './DeleteTask'
import userEvent from '@testing-library/user-event'
import { beforeEach, expect } from 'vitest'

const defaultProps = {
  taskId: '1',
  onClose: vi.fn(),
}

const { deleteTaskMock, resetMutationMock, unwrapMock, mutationState } = vi.hoisted(() => ({
  deleteTaskMock: vi.fn(),
  resetMutationMock: vi.fn(),
  unwrapMock: vi.fn(),
  mutationState: {
    isLoading: false,
    isError: false,
  },
}))

vi.mock('../api/deleteTaskApi.ts', () => ({
  useDeleteTaskMutation: () => [
    deleteTaskMock,
    {
      isLoading: mutationState.isLoading,
      isError: mutationState.isError,
      reset: resetMutationMock,
    },
  ],
}))

describe('DeleteTask', () => {
  beforeEach(() => {
    deleteTaskMock.mockReset()
    resetMutationMock.mockReset()
    unwrapMock.mockReset()
    defaultProps.onClose.mockReset()

    mutationState.isLoading = false
    mutationState.isError = false

    deleteTaskMock.mockReturnValue({
      unwrap: unwrapMock,
    })

    unwrapMock.mockResolvedValue({})
  })
  afterEach(() => {
    vi.restoreAllMocks()
  })

  test('renders the deletion confirmation', () => {
    render(<DeleteTask {...defaultProps} />)

    const dialog = screen.getByRole('alertdialog')

    expect(dialog).toHaveAccessibleName('Are you absolutely sure?')
    expect(dialog).toHaveAccessibleDescription(
      'This action cannot be undone. It will permanently delete your task.',
    )
  })
  test('calls deleteTask with the selected task id', async () => {
    const user = userEvent.setup()
    render(<DeleteTask {...defaultProps} />)

    await user.click(screen.getByRole('button', { name: 'Delete' }))

    expect(deleteTaskMock).toHaveBeenCalledWith({
      taskId: defaultProps.taskId,
    })
    expect(deleteTaskMock).toHaveBeenCalledTimes(1)
    expect(unwrapMock).toHaveBeenCalledTimes(1)
  })
  test('calls onClose after a successful deletion', async () => {
    const user = userEvent.setup()
    render(<DeleteTask {...defaultProps} />)

    await user.click(screen.getByRole('button', { name: 'Delete' }))

    await waitFor(() => {
      expect(defaultProps.onClose).toHaveBeenCalledTimes(1)
      expect(resetMutationMock).toHaveBeenCalledTimes(1)
    })
  })
  test('keeps the dialog open and shows an error when deletion fails', async () => {
    const user = userEvent.setup()
    const backendError = new Error('Failed to delete task')
    const consoleErrorMock = vi.spyOn(console, 'error').mockImplementation(() => undefined)

    unwrapMock.mockRejectedValueOnce(backendError)

    const { rerender } = render(<DeleteTask {...defaultProps} />)

    await user.click(
      screen.getByRole('button', {
        name: 'Delete',
      }),
    )
    await waitFor(() => {
      expect(consoleErrorMock).toHaveBeenCalledWith(backendError)
    })

    mutationState.isError = true
    rerender(<DeleteTask {...defaultProps} />)

    expect(defaultProps.onClose).not.toHaveBeenCalled()
    expect(screen.getByRole('alertdialog')).toBeInTheDocument()
    expect(screen.getByRole('alert')).toHaveTextContent('Failed to delete task. Please try again.')
  })
  test('calls onClose without deleting when Cancel is clicked', async () => {
    const user = userEvent.setup()
    render(<DeleteTask {...defaultProps} />)

    await user.click(screen.getByRole('button', { name: 'Cancel' }))

    expect(defaultProps.onClose).toHaveBeenCalledTimes(1)
    expect(resetMutationMock).toHaveBeenCalledTimes(1)
    expect(deleteTaskMock).not.toHaveBeenCalled()
    expect(unwrapMock).not.toHaveBeenCalled()
  })
  test('disables the Delete button while deletion is in progress', () => {
    mutationState.isLoading = true

    render(<DeleteTask {...defaultProps} />)

    const deleteButton = screen.getByRole('button', {
      name: 'Deleting...',
    })

    expect(deleteButton).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeDisabled()
  })
  test('does not show the confirmation when task id is null', () => {
    render(<DeleteTask {...defaultProps} taskId={null} />)

    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument()
    expect(deleteTaskMock).not.toHaveBeenCalled()
  })
})
