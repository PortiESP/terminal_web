import { useCallback } from "react"

export default function useTerminalCommands(cmds, stdin) {
  const run = useCallback((cmd) => {
    // If input was empty, dont do anything
    if (!cmd) return
    // If command exists
    const code = cmds[cmd]
    if (code) {
      switch (typeof code) {
        case "object":
          if (Array.isArray(code)) code.map((l) => stdin(l))
          else if (code.$$typeof) stdin(code)
          else throw new Error(`Typeof command '${cmd}' (${typeof code}) is not valid`)
          break
        case "string":
          stdin(code)
          break
        case "function":
          code(stdin)
          break
        default:
          throw new Error(`Typeof command '${cmd}' (${typeof code}) is not valid`)
          break
      }
    }
    // If command does not exist
    else {
      stdin(cmds.error)
    }
  }, [])

  return { run }
}
