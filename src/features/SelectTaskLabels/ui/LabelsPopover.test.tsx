import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { TaskLabel } from '@/entities/TaskLabel'
import LabelsPopover from './LabelsPopover'

const { createTaskLabelMock, unwrapMock, resetMutationMock, mutationState } = vi.hoisted(() => ({
  createTaskLabelMock: vi.fn(),
  unwrapMock: vi.fn(),
  resetMutationMock: vi.fn(),
  mutationState: {
    isLoading: false,
    isError: false,
  },
}))

vi.mock('../api/createTaskLabelApi.ts', () => ({
  useCreateTaskLabelMutation: () => [
    createTaskLabelMock,
    {
      isLoading: mutationState.isLoading,
      isError: mutationState.isError,
      reset: resetMutationMock,
    },
  ],
}))

const BOARD_ID = '22222222-2222-4222-8222-222222222222'
const BACKEND_LABEL_ID = '11111111-1111-4111-8111-111111111111'
const FRONTEND_LABEL_ID = '33333333-3333-4333-8333-333333333333'
const DESIGN_LABEL_ID = '44444444-4444-4444-8444-444444444444'

const availableLabels: TaskLabel[] = [
  {
    id: BACKEND_LABEL_ID,
    board_id: BOARD_ID,
    name: 'Backend',
    color: 'blue',
    created_at: '2026-09-10T00:00:00.000Z',
  },
  {
    id: FRONTEND_LABEL_ID,
    board_id: BOARD_ID,
    name: 'Frontend',
    color: 'green',
    created_at: '2026-09-10T00:00:00.000Z',
  },
]

const createdLabel: TaskLabel = {
  id: DESIGN_LABEL_ID,
  board_id: BOARD_ID,
  name: 'Design',
  color: 'purple',
  created_at: '2026-09-10T00:00:00.000Z',
}

const onSelectedLabelIdsChangeMock = vi.fn()
const onBusyChangeMock = vi.fn()

const defaultProps = {
  boardId: BOARD_ID,
  availableLabels,
  selectedLabelIds: [],
  onSelectedLabelIdsChange: onSelectedLabelIdsChangeMock,
  onBusyChange: onBusyChangeMock,
}

describe('LabelsPopover', () => {
  beforeEach(() => {
    createTaskLabelMock.mockReset()
    unwrapMock.mockReset()
    resetMutationMock.mockReset()
    onSelectedLabelIdsChangeMock.mockReset()
    onBusyChangeMock.mockReset()

    mutationState.isLoading = false
    mutationState.isError = false

    createTaskLabelMock.mockReturnValue({
      unwrap: unwrapMock,
    })

    unwrapMock.mockResolvedValue(createdLabel)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  test('opens the popover and shows available labels', async () => {
    const user = userEvent.setup()

    render(<LabelsPopover {...defaultProps} />)

    await user.click(screen.getByRole('button', { name: 'Add' }))

    expect(await screen.findByLabelText('Search')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Backend' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Frontend' })).toBeInTheDocument()
  })

  test('filters labels case-insensitively', async () => {
    const user = userEvent.setup()

    render(<LabelsPopover {...defaultProps} />)

    await user.click(screen.getByRole('button', { name: 'Add' }))
    await user.type(screen.getByLabelText('Search'), 'FRONT')

    expect(screen.getByRole('button', { name: 'Frontend' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Backend' })).not.toBeInTheDocument()
  })

  test('adds an unselected label', async () => {
    const user = userEvent.setup()

    render(<LabelsPopover {...defaultProps} />)

    await user.click(screen.getByRole('button', { name: 'Add' }))
    await user.click(screen.getByRole('button', { name: 'Backend' }))

    expect(onSelectedLabelIdsChangeMock).toHaveBeenCalledWith([BACKEND_LABEL_ID])
  })

  test('removes a selected label', async () => {
    const user = userEvent.setup()

    render(<LabelsPopover {...defaultProps} selectedLabelIds={[BACKEND_LABEL_ID]} />)

    await user.click(
      screen.getByRole('button', {
        name: 'Remove label Backend',
      }),
    )

    expect(onSelectedLabelIdsChangeMock).toHaveBeenCalledWith([])
  })

  test('does not offer creation for an existing label name', async () => {
    const user = userEvent.setup()

    render(<LabelsPopover {...defaultProps} />)

    await user.click(screen.getByRole('button', { name: 'Add' }))
    await user.type(screen.getByLabelText('Search'), ' bAcKeNd ')

    expect(
      screen.queryByRole('button', {
        name: /^Create /,
      }),
    ).not.toBeInTheDocument()

    expect(createTaskLabelMock).not.toHaveBeenCalled()
  })

  test('creates a label with the selected color and selects it', async () => {
    const user = userEvent.setup()

    render(<LabelsPopover {...defaultProps} />)

    await user.click(screen.getByRole('button', { name: 'Add' }))
    await user.type(screen.getByLabelText('Search'), '  Design  ')

    await user.click(
      screen.getByRole('button', {
        name: 'Select purple color',
      }),
    )

    await user.click(
      screen.getByRole('button', {
        name: 'Create "Design"',
      }),
    )

    await waitFor(() => {
      expect(createTaskLabelMock).toHaveBeenCalledWith({
        boardId: BOARD_ID,
        name: 'Design',
        color: 'purple',
      })
    })

    expect(unwrapMock).toHaveBeenCalledTimes(1)
    expect(onSelectedLabelIdsChangeMock).toHaveBeenCalledWith([DESIGN_LABEL_ID])
    expect(screen.getByLabelText('Search')).toHaveValue('')
  })

  test('keeps the popover open and shows an error when creation fails', async () => {
    const user = userEvent.setup()
    const backendError = new Error('Failed to create label')
    const consoleErrorMock = vi.spyOn(console, 'error').mockImplementation(() => undefined)

    unwrapMock.mockRejectedValueOnce(backendError)

    const { rerender } = render(<LabelsPopover {...defaultProps} />)

    await user.click(screen.getByRole('button', { name: 'Add' }))
    await user.type(screen.getByLabelText('Search'), 'Design')
    await user.click(
      screen.getByRole('button', {
        name: 'Create "Design"',
      }),
    )

    await waitFor(() => {
      expect(consoleErrorMock).toHaveBeenCalledWith(backendError)
    })

    mutationState.isError = true
    rerender(<LabelsPopover {...defaultProps} />)

    expect(screen.getByLabelText('Search')).toHaveValue('Design')
    expect(screen.getByRole('alert')).toHaveTextContent('Failed to create label. Please try again.')
  })

  test('disables interactions while creating a label', async () => {
    const user = userEvent.setup()
    const { rerender } = render(
      <LabelsPopover {...defaultProps} selectedLabelIds={[BACKEND_LABEL_ID]} />,
    )

    await user.click(screen.getByRole('button', { name: 'Add' }))
    await user.type(screen.getByLabelText('Search'), 'Design')

    mutationState.isLoading = true
    rerender(<LabelsPopover {...defaultProps} />)

    expect(screen.getByRole('button', { name: 'Add' })).toBeDisabled()
    expect(screen.getByLabelText('Search')).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Creating...' })).toBeDisabled()

    await waitFor(() => {
      expect(onBusyChangeMock).toHaveBeenLastCalledWith(true)
    })

    mutationState.isLoading = false
    rerender(<LabelsPopover {...defaultProps} selectedLabelIds={[BACKEND_LABEL_ID]} />)

    await waitFor(() => {
      expect(onBusyChangeMock).toHaveBeenLastCalledWith(false)
    })
  })

  test('does not submit the parent form', async () => {
    const user = userEvent.setup()
    const formSubmitMock = vi.fn()

    render(
      <form
        onSubmit={(event) => {
          event.preventDefault()
          formSubmitMock()
        }}
      >
        <LabelsPopover {...defaultProps} selectedLabelIds={[BACKEND_LABEL_ID]} />
      </form>,
    )

    await user.click(
      screen.getByRole('button', {
        name: 'Remove label Backend',
      }),
    )

    await user.click(screen.getByRole('button', { name: 'Add' }))
    await user.type(screen.getByLabelText('Search'), 'Design{Enter}')

    expect(createTaskLabelMock).toHaveBeenCalledTimes(1)
    expect(formSubmitMock).not.toHaveBeenCalled()
  })

  test('shows the empty state when no labels exist', async () => {
    const user = userEvent.setup()

    render(<LabelsPopover {...defaultProps} availableLabels={[]} />)

    await user.click(screen.getByRole('button', { name: 'Add' }))

    expect(screen.getByText('No labels yet. Enter a name to create one.')).toBeInTheDocument()
  })
})
