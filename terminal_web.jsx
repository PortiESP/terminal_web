import scss from "./terminal_web.module.scss"
import useTerminalPipes from "./hooks/use_terminal_pipes"
import useKBDListener from "./hooks/use_kbd_events"
import Lines from "./components/line/lines"
import usePrompt from "./components/prompt/prompt"
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
  const $terminal = useRef(null)
  const [customScreen, setCustomScreen] = useState(false)
  const { ListenerProvider } = useKBDListener()

  // Prompt settings
  const promptSettings = {
    keybinds: { ctrl_l: pipes.cleanBuffer, ...props.keybinds },
    prefix,
    pipes,
    commands,
    setScreen: setCustomScreen,
  }
  const { eventHandler, Prompt } = usePrompt(promptSettings)

  useEffect(() => {
    $terminal.current.scrollBy(0, 999999)
  }, [pipes.stdout])

  return (
    <div className={scss.wrapper} ref={$terminal} id="terminal-scroll-area">
      {customScreen || (
        <ListenerProvider callback={eventHandler}>
          <Lines lines={pipes.stdout}></Lines>
          <Prompt />
        </ListenerProvider>
      )}
    </div>
  )
}
