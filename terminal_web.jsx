import scss from "./terminal_web.module.scss"
import useTerminalPipes from "./hooks/use_terminal_pipes"
import useKBDListener from "./hooks/use_kbd_events"
import Lines from "./components/line/lines"
import usePrompt from "./components/prompt/prompt"
import { useEffect, useRef, useState } from "react"

/**
 * This component allows us to create a fake terminal with custom shell commands and keybinds
 *
 * @param {String} prefix -
 * @param {Array of Strings} initialMessage
 * @param {Array of Functions} keybinds
 * @param {Object} commands
 */
export default function TerminalWeb({ prefix, commands, ...props }) {
  console.log("TerminalWeb", prefix, commands, props)
  const pipes = useTerminalPipes(props.initialMessage)
  const $terminal = useRef(null)
  const [customScreen, setCustomScreen] = useState(false)
  const { ListenerProvider } = useKBDListener()

  // Prompt settings
  const { eventHandler, Prompt } = usePrompt({
    keybinds: { ctrl_l: pipes.cleanBuffer, ...props.keybinds },
    prefix,
    pipes,
    commands,
    setScreen: setCustomScreen,
  })

  // Scroll every time the user hits ENTER
  useEffect(() => {
    $terminal.current.scrollBy(0, 999999)
  }, [pipes.stdout])

  return (
    <div className={scss.wrapper} ref={$terminal} id="terminal-scroll-area" data-test="terminal">
      {customScreen || (
        <ListenerProvider callback={eventHandler}>
          <Lines lines={pipes.stdout}></Lines>
          <Prompt />
        </ListenerProvider>
      )}
    </div>
  )
}
