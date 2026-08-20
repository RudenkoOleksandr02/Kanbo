import { useCounterActions } from '../model/slice/counterSlice'
import { useCounterValue } from '../model/selectors/getCounterValue.ts'
import { Button } from '@/shared/ui/Button'

export const Counter = () => {
  const counterValue = useCounterValue()
  const { increment, decrement } = useCounterActions()

  const handleInc = () => {
    increment()
  }
  const handleDec = () => {
    decrement()
  }

  return (
    <div>
      <h1 data-testid="value-title">{counterValue}</h1>
      <Button onClick={handleInc} data-testid="increment-btn">
        increment
      </Button>
      <Button onClick={handleDec} data-testid="decrement-btn">
        decrement
      </Button>
    </div>
  )
}
