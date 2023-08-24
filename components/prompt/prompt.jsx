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

  const promptLen = () => input.concat(props.prefix).length

  const [caretOffset, setCaretOffset] = useState(promptLen() - 1)

  const handleKeyEvent = useCallback(
    (e) => {
      const parsedKey = keyEvent2String(e)

      switch (parsedKey) {
        case "enter":
          props.callback(e.target.value)
          setInput("")
          setCaretOffset(promptLen() - 1)
          break
        case "arrowleft":
          setCaretOffset((old) =>
            old > props.prefix.length - 1 ? old - 1 : old
          )
          break
        case "arrowright":
          setCaretOffset((old) => (old < promptLen() - 1 ? old + 1 : old))
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
    [input]
  )

  return (
    <pre className={scss.prompt}>
      <span>{props.prefix}</span>
      <input
        onKeyDown={handleKeyEvent}
        ref={props.inputRef}
        autoFocus={true}
        value={input}
        onChange={(e) => {
          setInput(e.target.value)
          setCaretOffset((old) => old + 1)
        }}
      ></input>
      {input.split("").map((letter, i) => (
        <span key={i}>{letter}</span>
      ))}
      <div className={scss.div__layer_caret}>
        {input
          .concat(props.prefix)
          .split("")
          .map((_, i) => (
            <pre key={i} style={{ order: i }}>
              {" "}
            </pre>
          ))}
        <span className={scss.caret} style={{ order: caretOffset }} />
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
