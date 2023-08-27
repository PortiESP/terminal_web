import scss from "./terminal_web.module.scss"
import useTerminalPipes from "./hooks/use_terminal_pipes"
import Lines from "./components/line/lines"
import Prompt from "./components/prompt/prompt"
import { useEffect, useRef, useState } from "react"

/**
 * Create a fake terminal that looks like a regular terminal emulator but with custom shell commands
 *
 * @param {String} prefix
 * @param {Array of Strings} initialMessage
 * @param {Array of Functions} keybinds
 * @param {Object} commands
 */
export default function TerminalWeb({ prefix, commands, ...props }) {
  const pipes = useTerminalPipes(props.initialMessage)
  const $prompt = useRef(null)
  const $terminal = useRef(null)
  const [customScreen, setCustomScreen] = useState(false)

  // Prompt settings
  const promptSettings = {
    keybinds: { ctrl_l: pipes.cleanBuffer, ...props.keybinds },
    prefix,
    pipes,
    commands,
    setScreen: setCustomScreen,
  }
  // Setting keybinds

  useEffect(() => {
    $terminal.current.scrollBy(0, 999999)
  }, [pipes.stdout])

  return (
    <div className={scss.wrapper} onClick={() => $prompt.current?.focus()} ref={$terminal} id="terminal-scroll-area">
      {customScreen || (
        <>
          <Lines lines={pipes.stdout}></Lines>
          <Prompt {...promptSettings} inputRef={$prompt} />
        </>
      )}
    </div>
  )
}
