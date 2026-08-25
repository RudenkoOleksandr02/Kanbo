import { type ReactNode, useEffect } from 'react'
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch.ts'
import { getUser, initAuthData, userActions } from '@/entities/User'
import { useSelector } from 'react-redux'
import { supabaseClient } from '@/shared/api/supabaseClient.ts'

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const dispatch = useAppDispatch()
  const { authReady, error } = useSelector(getUser)

  useEffect(() => {
    void dispatch(initAuthData())

    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange((event, session) => {
      if (event === 'INITIAL_SESSION') return

      dispatch(userActions.setAuthData(session?.user ?? null))
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [dispatch])

  if (!authReady) return <div>Loading...</div>
  if (error) return <div>{error}</div>

  return <>{children}</>
}

export default AuthProvider
