import { useEffect, useState } from "react"

export default function useSuggestions(inputState, availableCommands) {
  const [suggested, setSuggested] = useState("")

  // Choose the command that should be suggested (priority for the last command defined in the commands object)
  useEffect(() => {
    const result = inputState
      ? Object.keys(availableCommands)
          .filter((cmd) => RegExp(`^${inputState}.`).test(cmd))
          .pop()
      : undefined
    setSuggested(result)
  }, [inputState])

  return suggested
}
