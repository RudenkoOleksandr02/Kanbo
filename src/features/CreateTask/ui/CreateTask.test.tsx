import CreateTask from './CreateTask.tsx'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

const { createTaskMock, unwrapMock, resetMutationMock, mutationState } = vi.hoisted(() => ({
  createTaskMock: vi.fn(),
  unwrapMock: vi.fn(),
  resetMutationMock: vi.fn(),
  mutationState: {
    isLoading: false,
    isError: false,
  },
}))

vi.mock('../api/createTaskApi.ts', () => ({
  useCreateTaskMutation: () => [
    createTaskMock,
    {
      isLoading: mutationState.isLoading,
      isError: mutationState.isError,
      reset: resetMutationMock,
    },
  ],
}))

const LABEL_ID = '11111111-1111-4111-8111-111111111111'

describe('CreateTask', () => {
  beforeEach(() => {
    createTaskMock.mockReset()
    unwrapMock.mockReset()
    resetMutationMock.mockReset()

    mutationState.isLoading = false
    mutationState.isError = false

    createTaskMock.mockReturnValue({
      unwrap: unwrapMock,
    })

    unwrapMock.mockResolvedValue({})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  test('opens the dialog when Add Task is clicked', async () => {
    const user = userEvent.setup()

    render(<CreateTask columnId="column-1" renderLabelsField={() => null} />)

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

    await user.click(
      screen.getByRole('button', {
        name: 'Add Task',
      }),
    )

    expect(screen.getByRole('dialog')).toBeInTheDocument()

    expect(
      screen.getByRole('heading', {
        name: 'Create task',
      }),
    ).toBeInTheDocument()
  })

  test('does not submit when title is empty', async () => {
    const user = userEvent.setup()

    render(<CreateTask columnId="column-1" renderLabelsField={() => null} />)

    await user.click(
      screen.getByRole('button', {
        name: 'Add Task',
      }),
    )

    await user.click(
      screen.getByRole('button', {
        name: 'Save',
      }),
    )

    expect(await screen.findByRole('alert')).toHaveTextContent('Title is required')

    expect(createTaskMock).not.toHaveBeenCalled()
  })

  test('submits task data with column id', async () => {
    const user = userEvent.setup()

    render(<CreateTask columnId="column-1" renderLabelsField={() => null} />)

    await user.click(
      screen.getByRole('button', {
        name: 'Add Task',
      }),
    )

    await user.type(screen.getByLabelText('Title'), 'Learn RTK Query')
    await user.type(screen.getByLabelText('Description'), 'Create a task mutation')
    await user.type(screen.getByLabelText('Due date'), '2026-05-05')

    await user.click(
      screen.getByRole('button', {
        name: 'Save',
      }),
    )

    await waitFor(() => {
      expect(createTaskMock).toHaveBeenCalledWith({
        title: 'Learn RTK Query',
        description: 'Create a task mutation',
        columnId: 'column-1',
        dueDate: '2026-05-05',
        labelIds: [],
      })
    })

    expect(createTaskMock).toHaveBeenCalledTimes(1)
    expect(unwrapMock).toHaveBeenCalledTimes(1)
  })

  test('closes the dialog and resets the form after successful creation', async () => {
    const user = userEvent.setup()

    render(<CreateTask columnId="column-1" renderLabelsField={() => null} />)

    await user.click(
      screen.getByRole('button', {
        name: 'Add Task',
      }),
    )

    await user.type(screen.getByLabelText('Title'), 'New task')

    await user.type(screen.getByLabelText('Description'), 'Task description')

    await user.click(
      screen.getByRole('button', {
        name: 'Save',
      }),
    )

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })

    await user.click(
      screen.getByRole('button', {
        name: 'Add Task',
      }),
    )

    expect(screen.getByLabelText('Title')).toHaveValue('')

    expect(screen.getByLabelText('Description')).toHaveValue('')
  })

  test('keeps the dialog open and shows an error when creation fails', async () => {
    const user = userEvent.setup()
    const backendError = new Error('Failed to create task')

    const consoleErrorMock = vi.spyOn(console, 'error').mockImplementation(() => undefined)

    unwrapMock.mockRejectedValueOnce(backendError)

    const { rerender } = render(<CreateTask columnId="column-1" renderLabelsField={() => null} />)

    await user.click(
      screen.getByRole('button', {
        name: 'Add Task',
      }),
    )

    await user.type(screen.getByLabelText('Title'), 'Uncreated task')

    await user.click(
      screen.getByRole('button', {
        name: 'Save',
      }),
    )

    await waitFor(() => {
      expect(consoleErrorMock).toHaveBeenCalledWith(backendError)
    })

    mutationState.isError = true

    rerender(<CreateTask columnId="column-1" renderLabelsField={() => null} />)

    expect(screen.getByRole('dialog')).toBeInTheDocument()

    expect(screen.getByRole('alert')).toHaveTextContent('Failed to create task. Please try again.')

    expect(screen.getByLabelText('Title')).toHaveValue('Uncreated task')
  })

  test('disables the submit button while creating a task', async () => {
    mutationState.isLoading = true

    const user = userEvent.setup()

    render(<CreateTask columnId="column-1" renderLabelsField={() => null} />)

    await user.click(
      screen.getByRole('button', {
        name: 'Add Task',
      }),
    )

    expect(
      screen.getByRole('button', {
        name: 'Saving...',
      }),
    ).toBeDisabled()
  })

  test('disables form actions while creating a label', async () => {
    const user = userEvent.setup()

    render(
      <CreateTask
        columnId="column-1"
        renderLabelsField={({ onBusyChange }) => (
          <button type="button" onClick={() => onBusyChange(true)}>
            Start creating label
          </button>
        )}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Add Task' }))
    await user.click(screen.getByRole('button', { name: 'Start creating label' }))

    expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeDisabled()
    expect(screen.queryByRole('button', { name: 'Close' })).not.toBeInTheDocument()
  })

  test('closes the dialog without submitting when Cancel is clicked', async () => {
    const user = userEvent.setup()

    render(<CreateTask columnId="column-1" renderLabelsField={() => null} />)

    await user.click(
      screen.getByRole('button', {
        name: 'Add Task',
      }),
    )

    await user.type(screen.getByLabelText('Title'), 'Cancelled task')

    await user.click(
      screen.getByRole('button', {
        name: 'Cancel',
      }),
    )

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })

    expect(createTaskMock).not.toHaveBeenCalled()
    expect(resetMutationMock).toHaveBeenCalled()

    await user.click(
      screen.getByRole('button', {
        name: 'Add Task',
      }),
    )

    expect(screen.getByLabelText('Title')).toHaveValue('')
  })
  test('submits the selected label ids', async () => {
    const user = userEvent.setup()

    render(
      <CreateTask
        columnId="column-1"
        renderLabelsField={({ onSelectedLabelIdsChange }) => (
          <button type="button" onClick={() => onSelectedLabelIdsChange([LABEL_ID])}>
            Select Backend
          </button>
        )}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Add Task' }))
    await user.click(screen.getByRole('button', { name: 'Select Backend' }))
    await user.type(screen.getByLabelText('Title'), 'Task with label')
    await user.click(screen.getByRole('button', { name: 'Save' }))

    await waitFor(() => {
      expect(createTaskMock).toHaveBeenCalledWith({
        columnId: 'column-1',
        title: 'Task with label',
        description: '',
        dueDate: '',
        labelIds: [LABEL_ID],
      })
    })
  })
})
