import { useCallback, useState, useRef } from "react"
import scss from "./prompt.module.scss"
import useTimer from "../../hooks/use_timer"
import useTerminalCommands from "../../hooks/use_terminal_commands"
import useSuggestions from "./use_suggestions"
import useCommandHistory from "./use_command_history"
import useMobile from "../../hooks/use_mobile"
import MobileInterface from "./mobile_interface"

/**
 * This hook will create an input and a function that when provided to a ListenerProvider (useKBDListener hook) it can make the input react to some events
 *
 * @param {*} props
 * @param {String||JSXElement} props.prefix - Information printed before the prompt input (same line)
 * @param {Function} props.enter - Function called when the user presses the ENTER key
 * @param {Object} props.keybinds - Custom keybinds object. The keys correspond to the keybind, and the value must be a callback function
 * @param {Ref} props.inputRef - (Output) This parameter will take a useRef hook that will be linked to the input tag
 * @returns {Object}
 *  - {Function} - A predefined callback function that handles prompt related input events (this callback is provided to the ListenerProvider component from useKBDListener() hook)
 *  - {Component} - The prompt component of the terminal
 *
 * > Example of the keybinds object
 * > ```
 * > const binds = {
 * >   ctrl_c: () => console.log("Keystroke ctrl+c"),
 * >   p: () => console.log("Keystroke p"),
 * > }
 * > ```
 *
 */
export default function usePrompt({ pipes, keybinds, prefix, commands, setScreen }) {
  // Input state
  const [input, setInput] = useState("")
  // Input command history
  const { history, historyCursor, setHistoryCursor, pushHistory } = useCommandHistory(setInput)
  // Caret static effect while typing
  const $caret = useRef(null)
  const { setTimer } = useTimer()
  const [caretOffset, setCaretOffset] = useState(0)
  // Run commands
  const { run } = useTerminalCommands(commands, { pipes, setScreen })
  // Command suggestions
  const suggested = useSuggestions(input, commands)
  // Responsive context
  const { MobileRender } = useMobile()

  // Handle kbd events
  const handleKeyEvent = useCallback(
    (parsedKey, preventDefault) => {
      // Skip if prompt is disabled
      const resetLine = () => {
        setHistoryCursor(-1)
        setInput("")
        setCaretOffset(0)
      }

      // DEBUG
      // console.log(parsedKey)

      // Default keybinds
      switch (parsedKey) {
        case "enter":
          pipes.stdin(<OldPrompt prefix={prefix}>{input}</OldPrompt>)
          pushHistory(input)
          run(input)
          resetLine()
          break
        case "arrowleft":
          setCaretOffset((old) => (old > 0 - input.length ? old - 1 : old))
          break
        case "arrowright":
          setCaretOffset((old) => (old < 0 ? old + 1 : old))
          break
        case "arrowup":
          setHistoryCursor((old) => (old < history.length - 1 ? old + 1 : old))
          setCaretOffset(0)
          break
        case "arrowdown":
          setHistoryCursor((old) => (old > -1 ? old - 1 : old))
          setCaretOffset(0)
          break
        case "end":
          setCaretOffset(0)
          break
        case "home":
          setCaretOffset(0 - input.length)
          break
        case "ctrl_c":
          pipes.stdin(<OldPrompt prefix={prefix}>^C</OldPrompt>)
          resetLine()
          break
        case "tab":
          preventDefault()
          setInput(suggested || "help")
          break
        default:
          // Static caret effect
          $caret.current?.classList.add(scss.flag__caret_static)
          setTimer(() => {
            $caret.current?.classList.remove(scss.flag__caret_static)
          }, 1000)
          break
      }

      // Check if custom keybinds match the kbd input
      if (keybinds && keybinds[parsedKey]) {
        preventDefault()
        keybinds[parsedKey]()
      }
    },
    [input, historyCursor, suggested]
  )

  return {
    eventHandler: handleKeyEvent,
    Prompt: () => (
      <>
        <pre className={scss.prompt}>
          <input autoFocus value={input} onChange={(e) => setInput(e.target.value)} name="prompt" />
          <p className={scss.p__input}>
            {prefix}
            {input}
          </p>
          <div className={scss.div__layer_caret}>
            {(input + prefix).split("").map((_, i) => (
              <pre key={i} style={{ order: 0 - (input + prefix).length + i + 1 }}>
                {" "}
              </pre>
            ))}
            <span className={scss.caret} style={{ order: caretOffset }} ref={$caret} />
            {suggested && (
              <span className={scss.span__suggested} onClick={() => setInput(suggested)}>
                {" "}
                [tab] {suggested}
              </span>
            )}
          </div>
        </pre>
        <MobileRender>
          <MobileInterface commands={Object.keys(commands)} setInput={setInput} handleKeyEvent={handleKeyEvent} />
        </MobileRender>
      </>
    ),
  }
}

// Component that will be pushed to the stdoud history with special styles
function OldPrompt(props) {
  return (
    <span className={scss.flag__old_prompt}>
      {props.prefix}
      {props.children}
    </span>
  )
}
