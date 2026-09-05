import { render, screen } from '@testing-library/react'
import TaskColumn from './TaskColumn.tsx'

const { useDroppableMock, useSortableMock } = vi.hoisted(() => ({
  useDroppableMock: vi.fn(),
  useSortableMock: vi.fn(),
}))

vi.mock('@dnd-kit/react', async (importOriginal) => {
  const original = await importOriginal<typeof import('@dnd-kit/react')>()

  return {
    ...original,
    useDroppable: useDroppableMock,
  }
})

vi.mock('@dnd-kit/react/sortable', async (importOriginal) => {
  const original = await importOriginal<typeof import('@dnd-kit/react/sortable')>()

  return {
    ...original,
    useSortable: useSortableMock,
  }
})

const tasks = [
  {
    id: '1',
    title: 'Task 1',
    description: 'Description 1',
    dueDate: '25 августа',
    onEdit: vi.fn(),
    onDelete: vi.fn(),
  },
  {
    id: '2',
    title: 'Task 2',
    description: 'Description 2',
    dueDate: '29 августа',
    onEdit: vi.fn(),
    onDelete: vi.fn(),
  },
]

describe('TaskColumn', () => {
  beforeEach(() => {
    useDroppableMock.mockReset()
    useSortableMock.mockReset()

    useDroppableMock.mockReturnValue({ ref: vi.fn() })
    useSortableMock.mockReturnValue({ ref: vi.fn() })
  })

  test('renders tasks', () => {
    render(<TaskColumn title="Not started" columnId="1" tasks={tasks} />)

    expect(screen.getByText('Task 1')).toBeInTheDocument()
    expect(screen.getByText('Task 2')).toBeInTheDocument()
  })

  test('renders empty state', () => {
    render(<TaskColumn title="Done" columnId="1" tasks={[]} />)

    expect(screen.getByText('No tasks')).toBeInTheDocument()
  })

  test('disables task cards and the column drop zone while saving', () => {
    render(<TaskColumn title="Not started" columnId="1" tasks={tasks} isDragDisabled />)

    expect(useDroppableMock).toHaveBeenCalledWith(
      expect.objectContaining({
        id: '1',
        disabled: true,
      }),
    )
    expect(useSortableMock).toHaveBeenCalledTimes(tasks.length)
    expect(useSortableMock).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        id: '1',
        group: '1',
        disabled: true,
      }),
    )
    expect(useSortableMock).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        id: '2',
        group: '1',
        disabled: true,
      }),
    )
  })
})
