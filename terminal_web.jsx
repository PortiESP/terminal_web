import scss from "./terminal_web.module.scss"
import useTerminalHistory from "./hooks/use_terminal_history"
import Lines from "./components/line/lines"
import Color from "./components/color/color"
import Prompt from "./components/prompt/prompt"
import { useRef } from "react"
import art from "../../assets/0xporti_pixel_art"
import Line from "./components/line/line"

export default function TerminalWeb(props) {
  const { history, appendHistory, clearHistory } = useTerminalHistory([
    "",
    ...art,
    "",
    "",
    <Line> [i] Please, type one of the following commands</Line>,
    <Line>
      {" "}
      [i] Use <Color hex="4444ff">CTRL+L</Color> to clear the screen
    </Line>,
    "",
  ])
  const $prompt = useRef(null)
  const prefix = "Exter input here >>> "

  const binds = {
    ctrl_l: clearHistory,
  }

  return (
    <div className={scss.wrapper} onClick={() => $prompt.current.focus()}>
      <Lines lines={history}></Lines>
      <Prompt
        callback={(input) => appendHistory({ prefix, input })}
        keybinds={binds}
        prefix={prefix}
        inputRef={$prompt}
      />
    </div>
  )
}
