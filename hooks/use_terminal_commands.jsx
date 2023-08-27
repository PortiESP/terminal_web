import { useCallback } from "react"

export default function useTerminalCommands(cmds, options) {
  const run = useCallback((cmd) => {
    // If input was empty, dont do anything
    if (!cmd) return

    const { pipes, setScreen } = options

    // If command exists

    // If command is interactive
    if (cmd.split(" ")[0] === "run") {
      // Find the matchind command in the commands object
      setScreen(cmds[cmd])
    }
    // If command is not interactive
    else {
      const code = cmds[cmd]
      if (code) {
        switch (typeof code) {
          // In commands is defined as an object (array, JSX, ...)
          case "object":
            // If is Array
            if (Array.isArray(code)) code.map((l) => pipes.stdin(l))
            // If is JSX
            else if (code.$$typeof) pipes.stdin(code)
            // Anything else, ERROR
            else throw new Error(`Typeof command '${cmd}' (${typeof code}) is not valid`)
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
            throw new Error(`Typeof command '${cmd}' (${typeof code}) is not valid`)
            break
        }
      }
      // If command does not exist
      else {
        pipes.stdin(cmds.error)
      }
    }
  }, [])

  return { run }
}
