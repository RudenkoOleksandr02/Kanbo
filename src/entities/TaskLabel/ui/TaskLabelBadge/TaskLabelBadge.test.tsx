import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TaskLabelBadge from './TaskLabelBadge'

const labelMock = {
  id: '11111111-1111-4111-8111-111111111111',
  board_id: '22222222-2222-4222-8222-222222222222',
  name: 'Backend',
  color: 'blue',
  created_at: '2026-09-10T00:00:00.000Z',
} as const

describe('TaskLabelBadge', () => {
  test('renders the label name and color', () => {
    render(<TaskLabelBadge label={labelMock} />)

    const labelName = screen.getByText('Backend')

    expect(labelName).toBeInTheDocument()
    expect(labelName.parentElement).toHaveClass('bg-blue-100', 'text-blue-800')
  })

  test('calls onRemove when the remove button is clicked', async () => {
    const user = userEvent.setup()
    const onRemoveMock = vi.fn()

    render(<TaskLabelBadge label={labelMock} onRemove={onRemoveMock} />)

    await user.click(
      screen.getByRole('button', {
        name: 'Remove label Backend',
      }),
    )

    expect(onRemoveMock).toHaveBeenCalledTimes(1)
  })

  test('does not render the remove button without onRemove', () => {
    render(<TaskLabelBadge label={labelMock} />)

    expect(
      screen.queryByRole('button', {
        name: 'Remove label Backend',
      }),
    ).not.toBeInTheDocument()
  })

  test('does not remove the label when disabled', async () => {
    const user = userEvent.setup()
    const onRemoveMock = vi.fn()

    render(<TaskLabelBadge label={labelMock} onRemove={onRemoveMock} disabled />)

    const removeButton = screen.getByRole('button', {
      name: 'Remove label Backend',
    })

    expect(removeButton).toBeDisabled()

    await user.click(removeButton)

    expect(onRemoveMock).not.toHaveBeenCalled()
  })
})
