import { useCallback, useState, useRef, useEffect } from "react"
import scss from "./prompt.module.scss"
import useTimer from "../../hooks/use_timer"
import { prefix } from "../../../../assets/terminal_settings"
import useTerminalCommands from "../../hooks/use_terminal_commands"

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
export default function Prompt({ stdin, keybinds, prefix, commands, ...props }) {
  const [input, setInput] = useState("")
  const [history, setHistory] = useState(["superheroes", "about", "skills", "social", "projects"])
  const [historyCursor, setHistoryCursor] = useState(-1)
  const $caret = useRef(null)
  const { setTimer } = useTimer()
  const [caretOffset, setCaretOffset] = useState(0)
  const { run } = useTerminalCommands(commands, stdin)

  // Handle kbd events
  const handleKeyEvent = useCallback(
    (e) => {
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
          stdin(<OldPrompt prefix={prefix}>{inputValue}</OldPrompt>)
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
          stdin(<OldPrompt prefix={prefix}>^C</OldPrompt>)
          resetLine()
          break

        default:
          $caret.current.classList.add(scss.flag__caret_static)
          setTimer(() => {
            $caret.current.classList.remove(scss.flag__caret_static)
          }, 1000)
          break
      }

      // Check custom keybinds
      if (keybinds && keybinds[parsedKey]) {
        e.preventDefault()
        keybinds[parsedKey]()
      }
    },
    [input, historyCursor]
  )

  // Fill the input with the corresponding command from history when the history cursor is changed
  useEffect(() => {
    if (historyCursor > -1) setInput(history[historyCursor])
    else setInput("")
  }, [historyCursor])

  return (
    <pre className={scss.prompt}>
      <input
        onKeyDown={handleKeyEvent}
        ref={props.inputRef}
        autoFocus={true}
        value={input}
        onChange={(e) => {
          setInput(e.target.value)
        }}
      />
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

// Prompt logged to stdout
function OldPrompt(props) {
  return (
    <span className={scss.flag__old_prompt}>
      {props.prefix}
      {props.children}
    </span>
  )
}
