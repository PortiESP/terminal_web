import { useEffect, useState } from "react"

/**
 * This hook is used to parse a string and make a suggestion from the keys of an object
 *
 * @param {useState[0]} inputState - The state of the input that will be take to generate the suggestion
 * @param {Object} availableCommands - Object of commands
 * @returns {String} - Suggested command based on the input
 */
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
