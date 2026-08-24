import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch'
import { useSelector } from 'react-redux'
import { type ChangeEvent, type SubmitEvent } from 'react'
import { loginActions } from '../model/slice/loginSlice.ts'
import { loginByEmail } from '../model/services/loginByEmail.ts'
import { useNavigate } from 'react-router-dom'
import { getRouteBoard } from '@/shared/const/router.ts'
import { getLoginForm } from '../model/selectors/getLoginForm.ts'
import LoginFormView from './LoginFormView.tsx'

export function LoginForm({ className }: { className?: string }) {
  const dispatch = useAppDispatch()
  const { email, password, isLoading, error } = useSelector(getLoginForm)
  const navigate = useNavigate()

  const onChangeEmail = (event: ChangeEvent<HTMLInputElement>) => {
    dispatch(loginActions.setEmail(event.target.value))
  }

  const onChangePassword = (event: ChangeEvent<HTMLInputElement>) => {
    dispatch(loginActions.setPassword(event.target.value))
  }

  const onLoginSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (isLoading) return

    const result = await dispatch(loginByEmail({ email, password }))

    if (loginByEmail.fulfilled.match(result)) {
      navigate(getRouteBoard(), { replace: true })
    }
  }

  return (
    <LoginFormView
      className={className}
      error={error}
      isLoading={isLoading}
      email={email}
      password={password}
      onChangeEmail={onChangeEmail}
      onChangePassword={onChangePassword}
      onLoginSubmit={onLoginSubmit}
    />
  )
}
