import scss from "./terminal_web.module.scss"
import useTerminalHistory from "./hooks/use_terminal_history"
import Lines from "./components/line/lines"
import Prompt from "./components/prompt/prompt"
import { useRef } from "react"

export default function TerminalWeb(props) {
  const { history, appendHistory } = useTerminalHistory()
  const $prompt = useRef(null)

  return (
    <div className={scss.wrapper} onClick={() => $prompt.current.focus()}>
      <Lines lines={history}></Lines>

      <Prompt
        callback={appendHistory}
        prefix="Enter input here >>> "
        inputRef={$prompt}
      />
    </div>
  )
}
