import { useCallback } from "react"

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
  const handleKeyEvent = useCallback((e) => {
    const parsedKey = keyEvent2String(e)

    if (parsedKey === "enter") {
      props.callback(e.target.value)
      e.target.value = ""
    }

    // Check custom keybinds
    if (props.keybinds && props.keybinds[parsedKey]) {
      props.keybinds[parsedKey]()
    }
  }, [])

  return (
    <div>
      <pre>
        {props.prefix}
        <input onKeyDown={handleKeyEvent} ref={props.inputRef} />
      </pre>
    </div>
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
