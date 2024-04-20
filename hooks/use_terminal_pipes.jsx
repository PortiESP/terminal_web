import { useCallback, useState } from "react"

/**
 * Use this hook to create a manager fort the historial of the terminal
 *
 * @param {Array} initial - Array of strings that will be part of the initial array instead of having an empty array
 * @param {Function} callback - A function that will be called when a the stdout is altered, the function will be called and the new line will be passed as a parameter, or `undefined` if the stdout was cleaned (the call is made before the new lines are rendered!!!)
 * @returns {Object} - Utils of the hook
 *  - history {Array} - Array of strings
 *  - appendHistory {Function} - Add a new entry in the history array
 *  - clearHistory {Function} - Empty the history
 */
export default function useTerminalPipes(initial, callback) {
  const [stdout, setStdout] = useState(initial || [])
  // Define a method to push items to the `stdout` state array
  const stdin = useCallback((input) => {
    setStdout((old) => [...old, input || " "])
    callback && callback(input)
  }, [])

  // Define a method to empty the array of the `stdout` state
  const cleanBuffer = useCallback(() => {
    setStdout([])
    callback && callback(undefined)
  }, [])

  return {
    stdout,
    stdin,
    cleanBuffer,
  }
}
