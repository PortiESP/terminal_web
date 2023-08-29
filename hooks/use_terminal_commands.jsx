import { useCallback } from "react"

const INTERACTIVE_PREFIX = "run"

/**
 * This hook is used to handle the execution of commands from the provided commands object
 *
 * We can set the commands as: Strings, JSX, Functions or Arrays of strings/JSX
 *  - If we define a command as a function, the function will receive the pipes object (useTerminalPipes)
 *
 * IMPORTANT: If we name a command with the prefix `run`, the command must be a React component function (just the function name, NOT in JSX), which will receive 2 props:
 *  - props.exit - A funtion that must we executed when we want to exit and go back to the default prompt
 *  - props.params - An array of params provided by the command after the command name: Example `run myCommand 1 2 3`, the params will be [1, 2, 3]
 *
 * @param {Object} cmds - This parameter takes an object with the keys as the exact name of the commands
 * @param {Object} options - This parameter must take an object with the keys `pipes` and `setScreen`
 * @returns {Object} - Returns an object with the method `run` which will be called to
 */
export default function useTerminalCommands(commands, options) {
  const run = useCallback((cmd) => {
    // If input was empty, dont do anything
    if (!cmd) return

    // Destructure the screen management methods
    const { pipes, setScreen } = options

    // Check if command exists
    const frag = cmd.split(" ")
    const cmdName = frag.slice(0, 2).join(" ")
    if (!commands[cmdName]) {
      pipes.stdin(commands.error)
      return
    }

    // If command is interactive
    if (frag[0] === INTERACTIVE_PREFIX) {
      // Clean stdout
      pipes.cleanBuffer()
      // Find the matchind command in the commands object
      const CustomScreen = commands[cmdName]
      if (CustomScreen) setScreen(<CustomScreen exit={() => setScreen(undefined)} params={frag.slice(2)} />)
    }
    // If command is not interactive
    else {
      const code = commands[cmdName]
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
