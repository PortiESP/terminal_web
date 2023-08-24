import scss from "./terminal_web.module.scss"
import useTerminalPipes from "./hooks/use_terminal_pipes"
import Lines from "./components/line/lines"
import Prompt from "./components/prompt/prompt"
import { useCallback, useEffect, useRef } from "react"
import useTerminalCommands from "./hooks/use_terminal_commands"

export default function TerminalWeb(props) {
  const { stdout, stdin, cleanStdout } = useTerminalPipes(props.initialMessage)
  const { run } = useTerminalCommands(props.commands, stdin)
  const $prompt = useRef(null)
  const $terminal = useRef(null)

  // Setting keybinds
  const binds = {
    ctrl_l: cleanStdout,
  }

  // ENTER Callback
  const enterCallback = useCallback((input) => {
    stdin(props.prefix + input)
    run(input)
  }, [])

  useEffect(() => {
    $terminal.current.scrollTo(0, 999999)
  }, [stdout])

  return (
    <div className={scss.wrapper} onClick={() => $prompt.current.focus()} ref={$terminal}>
      <Lines lines={stdout}></Lines>
      <Prompt callback={enterCallback} keybinds={binds} prefix={props.prefix} inputRef={$prompt} />
    </div>
  )
}
