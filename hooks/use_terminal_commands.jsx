import { useCallback } from "react"

export default function useTerminalCommands(cmds, stdout) {
  const run = useCallback((cmd) => {
    // If input was empty, dont do anything
    if (!cmd) return
    // If command exists
    if (cmds[cmd]) {
      switch (typeof cmds[cmd]) {
        case "object":
          cmds[cmd].map((l) => stdout(l))
          break
        case "string":
          stdout(cmds[cmd])
          break
        case "function":
          stdout(cmds[cmd]())
          break
        default:
          throw new Error(`Typeof command '${cmd}' (${typeof cmds[cmd]}) is not valid`)
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
