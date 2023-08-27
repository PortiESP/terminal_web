import { useCallback } from "react"

export default function useTerminalCommands(cmds, options) {
  const run = useCallback((cmd) => {
    // If input was empty, dont do anything
    if (!cmd) return

    const { pipes, setScreen } = options

    // Check if command exists
    const frag = cmd.split(" ")
    const cmdName = frag.slice(0, 2).join(" ")
    if (!cmds[cmdName]) {
      pipes.stdin(cmds.error)
      return
    }

    // If command is interactive
    if (frag[0] === "run") {
      // Clean stdout
      pipes.cleanBuffer()
      // Find the matchind command in the commands object
      const CustomScreen = cmds[cmdName]
      if (CustomScreen) setScreen(<CustomScreen exit={() => setScreen(undefined)} p={frag} />)
    }
    // If command is not interactive
    else {
      const code = cmds[cmdName]
      if (code) {
        switch (typeof code) {
          // In commands is defined as an object (array, JSX, ...)
          case "object":
            if (Array.isArray(code)) code.map((l) => pipes.stdin(l))
            else if (code.$$typeof) pipes.stdin(code)
            else throw new Error(`Typeof command '${cmdName}' (${typeof code}) is not valid`)
            break
          // If command is defined as a string, just send it over the stdin
          case "string":
            pipes.stdin(code)
            break
          // If command is defined as a function, the parameter passed will be the terminal pipes {stdin, stdout, cleanBuffer} as well as an object with additional methods
          case "function":
            code(pipes)
            break
          default:
            throw new Error(`Typeof command '${cmdName}' (${typeof code}) is not valid`)
            break
        }
      }
      // If command does not exist
    }
  }, [])

  return { run }
}
