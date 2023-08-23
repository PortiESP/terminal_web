import scss from "./terminal_web.module.scss"
import useTerminalHistory from "./hooks/use_terminal_history"
import Lines from "./components/line/lines"
import Prompt from "./components/prompt/prompt"
import { useRef } from "react"

export default function TerminalWeb(props) {
  const { history, appendHistory, clearHistory } = useTerminalHistory()
  const $prompt = useRef(null)

  const binds = {
    ctrl_l: clearHistory,
  }

  return (
    <div className={scss.wrapper} onClick={() => $prompt.current.focus()}>
      <Lines lines={history}></Lines>
      <Prompt
        callback={appendHistory}
        keybinds={binds}
        prefix="Enter input here >>> "
        inputRef={$prompt}
      />
    </div>
  )
}
