import scss from "./terminal_web.module.scss"
import useTerminalHistory from "./hooks/use_terminal_history"
import Lines from "./components/line/lines"
import Prompt from "./components/prompt/prompt"
import { useCallback, useRef } from "react"
import useTerminalCommands from "./hooks/use_terminal_commands"

export default function TerminalWeb(props) {
  const { history, appendHistory, clearHistory } = useTerminalHistory(props.initialMessage)
  const { run } = useTerminalCommands(props.commands, appendHistory)
  const $prompt = useRef(null)

  // Setting keybinds
  const binds = {
    ctrl_l: clearHistory,
  }

  // ENTER Callback
  const enterCallback = useCallback((input) => {
    appendHistory(props.prefix + input)
    run(input)
  }, [])

  return (
    <div className={scss.wrapper} onClick={() => $prompt.current.focus()}>
      <Lines lines={history}></Lines>
      <Prompt callback={enterCallback} keybinds={binds} prefix={props.prefix} inputRef={$prompt} />
    </div>
  )
}
