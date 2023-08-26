import scss from "./terminal_web.module.scss"
import useTerminalPipes from "./hooks/use_terminal_pipes"
import Lines from "./components/line/lines"
import Prompt from "./components/prompt/prompt"
import { useEffect, useRef } from "react"
import { commands } from "../../assets/terminal_settings"

/**
 * Create a fake terminal that looks like a regular terminal emulator but with custom shell commands
 *
 * @param {String} prefix
 * @param {Array of Strings} initialMessage
 * @param {Object} commands
 */
export default function TerminalWeb(props) {
  const { stdout, stdin, cleanStdout } = useTerminalPipes(props.initialMessage)
  const $prompt = useRef(null)
  const $terminal = useRef(null)

  // Prompt settings
  const promptSettings = {
    binds: { ctrl_l: cleanStdout },
    prefix: props.prefix,
    stdin,
    commands,
  }
  // Setting keybinds

  useEffect(() => {
    $terminal.current.scrollBy(0, 999999)
  }, [stdout])

  return (
    <div className={scss.wrapper} onClick={() => $prompt.current.focus()} ref={$terminal} id="terminal-scroll-area">
      <Lines lines={stdout}></Lines>
      <Prompt {...promptSettings} inputRef={$prompt} />
    </div>
  )
}
