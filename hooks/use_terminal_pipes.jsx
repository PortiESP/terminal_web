import { useCallback, useState } from "react"

/**
 * Use this hook to create a manager fort the historial of the Termial
 *
 * @param {Array} initial - Array of strings that will be part of the initial array instead of having an empty array
 * @returns {Object} - Utils of the hook
 *  - history {Array} - Array of strings
 *  - appendHistory {Function} - Add a new entry in the history array
 *  - clearHistory {Function} - Empty the history
 */
export default function useTerminalPipes(initial) {
  const [stdout, setStdout] = useState(initial || [])

  //  Methods
  const stdin = useCallback((input) => setStdout((old) => [...old, input || " "]), [])

  const cleanStdout = useCallback(() => setStdout(() => []), [])

  return {
    stdout,
    stdin,
    cleanStdout,
  }
}
