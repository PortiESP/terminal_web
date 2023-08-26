import { useCallback } from "react"

export default function useTerminalCommands(cmds, stdout) {
  const run = useCallback((cmd) => {
    // If input was empty, dont do anything
    if (!cmd) return
    // If command exists
    const code = cmds[cmd]
    if (code) {
      switch (typeof code) {
        case "object":
          if (Array.isArray(code)) code.map((l) => stdout(l))
          else if (code.$$typeof) stdout(code)
          else throw new Error(`Typeof command '${cmd}' (${typeof code}) is not valid`)
          break
        case "string":
          stdout(code)
          break
        case "function":
          stdout(code())
          break
        default:
          throw new Error(`Typeof command '${cmd}' (${typeof code}) is not valid`)
          break
      }
    }
    // If command does not exist
    else {
      stdout(cmds.error)
    }
  }, [])

  return { run }
}
