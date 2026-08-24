import { cn } from '@/shared/lib/utils'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/Card'
import { Field, FieldGroup, FieldLabel } from '@/shared/ui/Field'
import { Input } from '@/shared/ui/Input'
import type { ChangeEvent, SubmitEvent } from 'react'
import { Button } from '@/shared/ui/Button'

interface LoginFormViewProps {
  className?: string
  error?: string
  isLoading: boolean
  email: string
  password: string
  onChangeEmail: (event: ChangeEvent<HTMLInputElement>) => void
  onChangePassword: (event: ChangeEvent<HTMLInputElement>) => void
  onLoginSubmit: (event: SubmitEvent<HTMLFormElement>) => void
}

const LoginFormView = (props: LoginFormViewProps) => {
  const {
    className,
    error,
    isLoading,
    email,
    password,
    onChangeEmail,
    onChangePassword,
    onLoginSubmit,
  } = props

  return (
    <div className={cn('flex flex-col gap-6', className)}>
      <Card>
        <CardHeader>
          <CardTitle>
            <h1>Login to your account</h1>
          </CardTitle>
          <CardDescription>Enter your email below to login to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onLoginSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={onChangeEmail}
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={onChangePassword}
                />
              </Field>
              <Field>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Logging in...' : 'Login'}
                </Button>
              </Field>
            </FieldGroup>
          </form>
          {error && (
            <p role="alert" className="text-destructive text-sm">
              {error}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default LoginFormView
