import { useCallback, useState, useRef, useEffect } from "react"
import scss from "./prompt.module.scss"
import useTimer from "../../hooks/use_timer"
import useTerminalCommands from "../../hooks/use_terminal_commands"
import useSuggestions from "./use_suggestions"

/**
 * This component will create an input where we can run callbacks based on custom keybinds, the ENTER key have a dedicated props for its event as `callback`
 *
 * @param {*} props
 * @param {String||JSXElement} props.prefix - Information printed before the prompt input (same line)
 * @param {Function} props.enter - Function called when the user presses the ENTER key
 * @param {Object} props.keybinds - Custom keybinds object. The keys correspond to the keybind, and the value must be a callback function
 * @param {Ref} props.inputRef - (Output) This parameter will take a useRef hook that will be linked to the input tag
 * @returns {JSXElement}
 * 
 * Example of the keybinds object
 * ```
  const binds = {
    ctrl_c: () => console.log("Keystroke ctrl+c"),
    p: () => console.log("Keystroke p"),
  }
 * ```
 * 
 */
export default function Prompt({ pipes, keybinds, prefix, commands, setScreen, ...props }) {
  // Input state
  const [input, setInput] = useState("")
  // Input command history
  const [history, setHistory] = useState(["superheroes", "about", "skills", "social", "projects"])
  const [historyCursor, setHistoryCursor] = useState(-1)
  // Caret static effect while typing
  const $caret = useRef(null)
  const { setTimer } = useTimer()
  const [caretOffset, setCaretOffset] = useState(0)
  // Run commands
  const { run } = useTerminalCommands(commands, { pipes, setScreen })
  // Command suggestions
  const suggested = useSuggestions(input, commands)

  // Handle kbd events
  const handleKeyEvent = useCallback(
    (e) => {
      // Skip if prompt is disabled
      const parsedKey = keyEvent2String(e)
      const inputValue = e.target.value
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
          pipes.stdin(<OldPrompt prefix={prefix}>{inputValue}</OldPrompt>)
          setHistory((old) => [inputValue, ...old])
          run(inputValue)
          resetLine()
          break
        case "arrowleft":
          setCaretOffset((old) => (old > 0 - inputValue.length ? old - 1 : old))
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
          setCaretOffset(0 - inputValue.length)
          break
        case "ctrl_c":
          pipes.stdin(<OldPrompt prefix={prefix}>^C</OldPrompt>)
          resetLine()
          break
        case "tab":
          e.preventDefault()
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
        e.preventDefault()
        keybinds[parsedKey]()
      }
    },
    [input, historyCursor, suggested]
  )

  // Fill the input with the corresponding command from history when the history cursor is changed
  useEffect(() => {
    if (historyCursor > -1) setInput(history[historyCursor])
    else setInput("")
  }, [historyCursor])

  return (
    <pre className={scss.prompt} onKeyDown={handleKeyEvent}>
      <input ref={props.inputRef} autoFocus value={input} onChange={(e) => setInput(e.target.value)} />
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
        {suggested && <span className={scss.span__suggested}> [tab] {suggested}</span>}
      </div>
    </pre>
  )
}

/**
 * Converts a DOM Event object into a string that represents the keybind
 *
 * @param {SyntheticEvent} e - Keyboard DOM Event
 * @returns - A string of the corresponding keybind for computable object keys
 */
function keyEvent2String(e) {
  const isSpecial = ["Control", "Shift"].includes(e.key)
  // prettier-ignore
  const prefix = !isSpecial
    ? `${
        e.ctrlKey ? "ctrl_" : ""
      }${
        e.shiftKey ? "shift_" : ""
      }${
        e.altKey ? "alt_" : ""
      }`
    : ""

  return `${prefix}${e.key.toLowerCase()}`
}

// Prompt logged to stdout component
function OldPrompt(props) {
  return (
    <span className={scss.flag__old_prompt}>
      {props.prefix}
      {props.children}
    </span>
  )
}
