import { useCallback } from "react"

export default function useTerminalCommands(cmds, stdout) {
  const run = useCallback((cmd) => {
    cmds[cmd] && cmds[cmd].map((l) => stdout(l))
  }, [])

  return { run }
}
