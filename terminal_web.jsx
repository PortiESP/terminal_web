import scss from "./terminal_web.module.scss"
import useTerminalPipes from "./hooks/use_terminal_pipes"
import Lines from "./components/line/lines"
import Prompt from "./components/prompt/prompt"
import { useCallback, useEffect, useRef } from "react"
import useTerminalCommands from "./hooks/use_terminal_commands"

/**
 * Create a fake terminal that looks like a regular terminal emulator but with custom shell commands
 *
 * @param {String} prefix
 * @param {Array of Strings} initialMessage
 * @param {Object} commands
 */
export default function TerminalWeb(props) {
  const { stdout, stdin, cleanStdout } = useTerminalPipes(props.initialMessage)
  const { run } = useTerminalCommands(props.commands, stdin)
  const $prompt = useRef(null)
  const $terminal = useRef(null)

  // Setting keybinds
  const binds = { ctrl_l: cleanStdout }

  // ENTER Callback
  const enterCallback = useCallback((input) => {
    stdin(<OldPrompt prefix={props.prefix}>{input}</OldPrompt>)
    run(input)
  }, [])

  useEffect(() => {
    $terminal.current.scrollBy(0, 999999)
  }, [stdout])

  return (
    <div className={scss.wrapper} onClick={() => $prompt.current.focus()} ref={$terminal} id="terminal-scroll-area">
      <Lines lines={stdout}></Lines>
      <Prompt enter={enterCallback} keybinds={binds} prefix={props.prefix} inputRef={$prompt} />
    </div>
  )
}

function OldPrompt(props) {
  return (
    <span className={scss.flag__old_prompt}>
      {props.prefix}
      {props.children}
    </span>
  )
}
