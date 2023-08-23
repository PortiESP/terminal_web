import { useCallback, useState } from "react"
import scss from "./prompt.module.scss"

/**
 * This component will create an input where we can run callbacks based on custom keybinds, the ENTER key have a dedicated props for its event as `callback`
 *
 * @param {*} props
 * @param {String||JSXElement} props.prefix - Information printed before the prompt input (same line)
 * @param {Function} props.callback - Function called when the user presses the ENTER key
 * @param {Object} props.keybinds - Custom keybinds object. The keys correspond to the keybind, and the value must be a callback function
 * @param {Ref} props.inputRef - 
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
export default function Prompt(props) {
  const [input, setInput] = useState("")
  const [caretOffset, setCaretOffset] = useState(0)

  const handleKeyEvent = useCallback(
    (e) => {
      const parsedKey = keyEvent2String(e)

      switch (parsedKey) {
        case "enter":
          props.callback(e.target.value)
          setInput("")
          setCaretOffset(0)
          break
        case "arrowleft":
          setCaretOffset((old) => (old < input.length ? old + 1 : old))
          break
        case "arrowright":
          setCaretOffset((old) => (old > 0 ? old - 1 : 0))
          break

        default:
          break
      }

      // DEBUG
      // console.log(parsedKey)

      // Check custom keybinds
      if (props.keybinds && props.keybinds[parsedKey]) {
        e.preventDefault()
        props.keybinds[parsedKey]()
      }
    },
    [input, caretOffset]
  )

  return (
    <pre className={scss.prompt}>
      <span style={{ order: -1 }}>{props.prefix}</span>
      <input
        onKeyDown={handleKeyEvent}
        ref={props.inputRef}
        autoFocus={true}
        value={input}
        onChange={(e) => setInput(e.target.value)}
      ></input>
      {input.split("").map((letter, i) => (
        <span key={i} style={{ order: i }}>
          {letter}
        </span>
      ))}
      <span
        className={scss.caret}
        style={{ order: input.length - caretOffset - 1 }}
      />
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
