import { render, screen } from '@testing-library/react'
import type { BoardData } from '@/entities/Board'
import BoardPage from './BoardPage.tsx'

vi.mock('@/entities/Board', () => {
  const data = {
    id: 'board-1',
    owner_id: 'user-1',
    title: 'Personal',
    description: 'A board to keep track of personal tasks.',
    created_at: '2026-08-27T00:00:00.000Z',
    columns: [
      {
        id: 'column-1',
        board_id: 'board-1',
        title: 'Not started',
        position: 0,
        created_at: '2026-08-27T00:00:00.000Z',
        tasks: [
          {
            id: 'task-1',
            column_id: 'column-1',
            title: 'Take Coco to a vet',
            description: null,
            due_date: '2026-11-04',
            position: 0,
            created_at: '2026-08-27T00:00:00.000Z',
          },
        ],
      },
      {
        id: 'column-2',
        board_id: 'board-1',
        title: 'Done',
        position: 1,
        created_at: '2026-08-27T00:00:00.000Z',
        tasks: [],
      },
    ],
  } satisfies BoardData

  return {
    useGetBoardQuery: () => ({
      data,
      isLoading: false,
      isFetching: false,
      error: undefined,
      refetch: vi.fn(),
    }),
  }
})

vi.mock('@/features/Logout', () => ({
  LogoutButton: () => null,
}))
vi.mock('@/features/CreateTask', () => ({
  CreateTask: () => null,
}))
vi.mock('@/features/DeleteTask', () => ({
  DeleteTask: () => null,
}))
vi.mock('@/features/ReorderTasks', () => ({
  useTaskDragAndDrop: () => ({
    draftColumns: null,
    isSavingTaskOrder: false,
    handleDragStart: vi.fn(),
    handleDragOver: vi.fn(),
    handleDragEnd: vi.fn(),
  }),
}))

describe('BoardPage', () => {
  test('renders board, columns and tasks from query data', () => {
    render(<BoardPage />)

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Personal',
      }),
    ).toBeInTheDocument()

    expect(screen.getByText('A board to keep track of personal tasks.')).toBeInTheDocument()

    expect(
      screen.getByRole('heading', {
        level: 2,
        name: 'Not started',
      }),
    ).toBeInTheDocument()

    expect(
      screen.getByRole('heading', {
        level: 2,
        name: 'Done',
      }),
    ).toBeInTheDocument()

    expect(screen.getByText('Take Coco to a vet')).toBeInTheDocument()
    expect(screen.getByText('Due 2026-11-04')).toBeInTheDocument()
    expect(screen.getByText('No tasks')).toBeInTheDocument()
  })
})
