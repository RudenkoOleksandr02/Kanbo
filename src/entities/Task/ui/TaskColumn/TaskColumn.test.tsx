import { render, screen } from '@testing-library/react'
import TaskColumn from './TaskColumn.tsx'

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
  test('renders tasks', () => {
    render(<TaskColumn title="Not started" tasks={tasks} />)

    expect(screen.getByText('Task 1')).toBeInTheDocument()
    expect(screen.getByText('Task 2')).toBeInTheDocument()
  })

  test('renders empty state', () => {
    render(<TaskColumn title="Done" tasks={[]} />)

    expect(screen.getByText('No tasks')).toBeInTheDocument()
  })
})
