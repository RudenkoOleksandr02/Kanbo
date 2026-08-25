import { Button } from '@/shared/ui/Button'
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch.ts'
import { logoutUser } from '../model/services/logoutUser.ts'

const LogoutButton = () => {
  const dispatch = useAppDispatch()

  const onLogout = () => {
    void dispatch(logoutUser())
  }

  return <Button onClick={onLogout}>Logout</Button>
}

export default LogoutButton
