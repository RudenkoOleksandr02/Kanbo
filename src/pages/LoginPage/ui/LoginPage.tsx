import { LoginForm } from '@/features/AuthByEmail'

const LoginPage = () => {
  return (
    <main className="bg-muted flex min-h-screen items-center justify-center p-4">
      <LoginForm className="w-full max-w-sm" />
    </main>
  )
}

export default LoginPage
