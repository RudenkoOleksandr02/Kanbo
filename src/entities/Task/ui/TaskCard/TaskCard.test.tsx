import TaskCard from './TaskCard.tsx'
import { render, screen } from '@testing-library/react'

describe('TaskCard', () => {
  test('renders task information', () => {
    render(
      <TaskCard
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        title="Сделать авторизацию"
        description="Добавить вход через Supabase"
        dueDate="25 августа"
      />,
    )

    expect(screen.getByText('Сделать авторизацию')).toBeInTheDocument()
    expect(screen.getByText('Добавить вход через Supabase')).toBeInTheDocument()
    expect(screen.getByText('Due 25 августа')).toBeInTheDocument()
  })
})
