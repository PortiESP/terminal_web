import { useCallback, useState } from "react"

export default function useTimer() {
  // Object containing the timer object with the structure {timerId: Integer, timestamp: Integer}
  const [activeTimer, setActiveTimer] = useState(undefined)

  // Stops the current integer and start a new one, we must provide a callback and the time parameters
  const setTimer = useCallback(
    (callback, time) => {
      activeTimer && clearTimeout(activeTimer.timerId)
      setActiveTimer({
        timerId: setTimeout(callback, time),
        timestamp: Date.now(),
      })
    },
    [activeTimer]
  )

  //  Delete the current timer
  const deleteTimer = useCallback(
    () => clearTimeout(activeTimer.timerId),
    [activeTimer]
  )

  return { activeTimer, setTimer, deleteTimer }
}
