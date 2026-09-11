import EditTask from './EditTask'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

const defaultProps = {
  task: {
    id: '1',
    title: 'title',
    description: 'description',
    dueDate: '2026-05-05',
    labelIds: [],
  },
  onClose: vi.fn(),
  renderLabelsField: () => null,
}

const { updateTaskMock, mutationState, resetMutationMock, unwrapMock } = vi.hoisted(() => ({
  updateTaskMock: vi.fn(),
  resetMutationMock: vi.fn(),
  unwrapMock: vi.fn(),
  mutationState: {
    isLoading: false,
    isError: false,
  },
}))

vi.mock('../api/updateTaskApi.ts', () => ({
  useUpdateTaskMutation: () => [
    updateTaskMock,
    {
      isLoading: mutationState.isLoading,
      isError: mutationState.isError,
      reset: resetMutationMock,
    },
  ],
}))

const LABEL_ID = '11111111-1111-4111-8111-111111111111'

describe('EditTask', () => {
  beforeEach(() => {
    updateTaskMock.mockReset()
    unwrapMock.mockReset()
    resetMutationMock.mockReset()
    defaultProps.onClose.mockReset()

    mutationState.isLoading = false
    mutationState.isError = false

    updateTaskMock.mockReturnValue({
      unwrap: unwrapMock,
    })

    unwrapMock.mockResolvedValue({})
  })
  afterEach(() => {
    vi.restoreAllMocks()
  })

  test('renders the selected task values', () => {
    render(<EditTask {...defaultProps} />)

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByLabelText('Title')).toHaveValue(defaultProps.task.title)
    expect(screen.getByLabelText('Description')).toHaveValue(defaultProps.task.description)
    expect(screen.getByLabelText('Due date')).toHaveValue(defaultProps.task.dueDate)
  })
  test('does not submit when title is empty', async () => {
    const user = userEvent.setup()
    render(<EditTask {...defaultProps} />)

    await user.clear(screen.getByLabelText('Title'))
    await user.click(screen.getByRole('button', { name: 'Save' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('Title is required')
    expect(updateTaskMock).not.toHaveBeenCalled()
  })
  test('submits updated task data with task id', async () => {
    const user = userEvent.setup()
    render(<EditTask {...defaultProps} />)

    await user.clear(screen.getByLabelText('Title'))
    await user.clear(screen.getByLabelText('Description'))
    await user.clear(screen.getByLabelText('Due date'))

    await user.type(screen.getByLabelText('Title'), 'updated title')
    await user.type(screen.getByLabelText('Description'), 'updated description')
    await user.type(screen.getByLabelText('Due date'), '2026-11-11')

    await user.click(screen.getByRole('button', { name: 'Save' }))

    await waitFor(() => {
      expect(updateTaskMock).toHaveBeenCalledWith({
        taskId: defaultProps.task.id,
        title: 'updated title',
        description: 'updated description',
        dueDate: '2026-11-11',
        labelIds: [],
      })
    })

    expect(updateTaskMock).toHaveBeenCalledTimes(1)
    expect(unwrapMock).toHaveBeenCalledTimes(1)
  })
  test('calls onClose after a successful update', async () => {
    const user = userEvent.setup()
    render(<EditTask {...defaultProps} />)

    await user.click(screen.getByRole('button', { name: 'Save' }))

    await waitFor(() => {
      expect(defaultProps.onClose).toHaveBeenCalledTimes(1)
      expect(resetMutationMock).toHaveBeenCalledTimes(1)
    })
  })
  test('keeps the dialog open and shows an error when the update fails', async () => {
    const user = userEvent.setup()
    const backendError = new Error('Failed to update task')
    const consoleErrorMock = vi.spyOn(console, 'error').mockImplementation(() => undefined)

    unwrapMock.mockRejectedValueOnce(backendError)

    const { rerender } = render(<EditTask {...defaultProps} />)

    await user.click(
      screen.getByRole('button', {
        name: 'Save',
      }),
    )
    await waitFor(() => {
      expect(consoleErrorMock).toHaveBeenCalledWith(backendError)
    })

    mutationState.isError = true
    rerender(<EditTask {...defaultProps} />)

    expect(defaultProps.onClose).not.toHaveBeenCalled()
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByRole('alert')).toHaveTextContent('Failed to update task. Please try again.')
  })
  test('calls onClose without updating when Cancel is clicked', async () => {
    const user = userEvent.setup()
    render(<EditTask {...defaultProps} />)

    await user.clear(screen.getByLabelText('Title'))
    await user.type(screen.getByLabelText('Title'), 'Unsaved title')

    await user.click(
      screen.getByRole('button', {
        name: 'Cancel',
      }),
    )

    await waitFor(() => {
      expect(defaultProps.onClose).toHaveBeenCalledTimes(1)
      expect(resetMutationMock).toHaveBeenCalledTimes(1)
    })
    expect(updateTaskMock).not.toHaveBeenCalled()
  })
  test('submits the updated label ids', async () => {
    const user = userEvent.setup()

    render(
      <EditTask
        {...defaultProps}
        task={{
          ...defaultProps.task,
          labelIds: [LABEL_ID],
        }}
        renderLabelsField={({ selectedLabelIds, onSelectedLabelIdsChange }) => (
          <button type="button" onClick={() => onSelectedLabelIdsChange([])}>
            Remove selected labels: {selectedLabelIds.join(',')}
          </button>
        )}
      />,
    )

    expect(
      screen.getByRole('button', {
        name: `Remove selected labels: ${LABEL_ID}`,
      }),
    ).toBeInTheDocument()

    await user.click(
      screen.getByRole('button', {
        name: `Remove selected labels: ${LABEL_ID}`,
      }),
    )

    await user.click(screen.getByRole('button', { name: 'Save' }))

    await waitFor(() => {
      expect(updateTaskMock).toHaveBeenCalledWith({
        taskId: defaultProps.task.id,
        title: defaultProps.task.title,
        description: defaultProps.task.description,
        dueDate: defaultProps.task.dueDate,
        labelIds: [],
      })
    })
  })
})
