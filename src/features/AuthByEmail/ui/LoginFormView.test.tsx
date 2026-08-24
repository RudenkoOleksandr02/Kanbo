import { render, screen } from '@testing-library/react'
import LoginFormView from './LoginFormView.tsx'

const defaultProps = {
  email: '',
  password: '',
  isLoading: false,
  onChangeEmail: vi.fn(),
  onChangePassword: vi.fn(),
  onLoginSubmit: vi.fn(),
}

describe('LoginFormView', () => {
  test('disables the button while login is loading', () => {
    render(<LoginFormView {...defaultProps} isLoading />)

    const button = screen.getByRole('button', {
      name: 'Logging in...',
    })

    expect(button).toBeDisabled()
  })

  test('renders login error', () => {
    render(<LoginFormView {...defaultProps} error="Invalid login credentials" />)

    expect(screen.getByRole('alert')).toHaveTextContent('Invalid login credentials')
  })
})
