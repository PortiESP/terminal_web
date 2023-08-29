import { useState, useEffect, useCallback } from "react"

/**
 * This hook is used to manage the history of the commands used by the terminal
 *
 * @param {Function} setInput - State setter of the prompt input value
 * @returns {Object}
 *  - @returns {Object.history} - Array of the commands
 *  - @returns {Object.historyCursor} - Current item of the list pointed
 *  - @returns {Object.pushHistory} - Append a new item to the history list
 *  - @returns {Object.setHistoryCursor} - Update list pointer
 */
export default function useCommandHistory(setInput, defaultCommands) {
  // Commands list state
  const [history, setHistory] = useState(defaultCommands || [])
  // Command list pointer
  const [historyCursor, setHistoryCursor] = useState(-1)

  // Push to history
  const pushHistory = useCallback((value) => value && setHistory((old) => [value, ...old]), [])

  // Fill the input with the corresponding command from history when the history cursor is changed
  useEffect(() => {
    if (historyCursor > -1) setInput(history[historyCursor])
    else setInput("")
  }, [historyCursor])

  return { history, historyCursor, setHistoryCursor, pushHistory }
}
