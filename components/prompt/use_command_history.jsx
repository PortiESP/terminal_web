import { useState, useEffect, useCallback } from "react"

export default function useCommandHistory(setInput) {
  const [history, setHistory] = useState(["superheroes", "about", "skills", "social", "projects"])
  const [historyCursor, setHistoryCursor] = useState(-1)

  // Push to history
  const pushHistory = useCallback((value) => value && setHistory((old) => [value, ...old]), [])

  // Fill the input with the corresponding command from history when the history cursor is changed
  useEffect(() => {
    if (historyCursor > -1) setInput(history[historyCursor])
    else setInput("")
  }, [historyCursor])

  return { history, setHistory, historyCursor, setHistoryCursor, pushHistory }
}
