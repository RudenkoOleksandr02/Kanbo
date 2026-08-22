import { render, screen } from '@testing-library/react'
import { Button } from './Button.tsx'

describe('Button', () => {
  test('renders with its text', () => {
    render(<Button>Click</Button>)

    const button = screen.getByRole('button', {
      name: 'Click',
    })

    expect(button).toBeInTheDocument()
  })
})
