import { useCallback, useState } from "react"

/**
 * This hook will help us handling a timer that can be removed and restarted easier
 *
 * @returns {Object} - Returns an object with the following methods
 *  activeTimer - This attribute is an object with the timer Id and the timestamp of the timer definition
 *  setTimer(callback, time) - Create/Restart a timer that will call the `callback` function after some `time` (ms)
 *  stopTimer() - Stop the timer
 */
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
  const stopTimer = useCallback(() => clearTimeout(activeTimer.timerId), [activeTimer])

  return { activeTimer, setTimer, stopTimer }
}
