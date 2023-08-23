import scss from "./terminal_web.module.scss"
import useTerminalHistory from "./hooks/use_terminal_history"
import Lines from "./components/line/lines"
import Prompt from "./components/prompt/prompt"

export default function TerminalWeb(props) {
  const { history, appendHistory } = useTerminalHistory()

  return (
    <div className={scss.wrapper}>
      <Lines lines={history}></Lines>

      <Prompt callback={appendHistory} prefix="Enter input here >>> " />
    </div>
  )
}
