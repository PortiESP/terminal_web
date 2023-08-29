import { useRef } from "react"

/**
 * This hook will creates a component that will listen to keyboard events triggered by the elements wrapped inside
 *
 * @returns {Object} - Returns an object with the listener component
 */
export default function useKBDListener() {
  return {
    ListenerProvider,
  }
}

/**
 * This React component will handle the keyboard events triggered by any of the elements wrapped inside
 *
 * {PROPS}
 * @param {Boolean} props.callback - Callback called when an event is recorded, the event code is passed along with the event prevent default function `callback('ctrl_c', ()=> event.preventDefault())`
 * @param {Boolean} props.debug - This flag is set when we want to log to the console the keys recorded by the listener
 * @param {Boolean} props.children - Wrapped JSX code
 * @returns
 */
function ListenerProvider(props) {
  const $input = useRef(null)
  return (
    <div
      onKeyDown={(event) => {
        const parsedKey = keyEvent2String(event)
        const preventFunc = () => event.preventDefault()
        // DEBUG
        props.debug && console.log(parsedKey)
        // Event callback
        props.callback(parsedKey, preventFunc)
      }}
      onClick={() => $input.current.focus()}
      style={frameStyle}
    >
      <input autoFocus style={{ opacity: 0, position: "absolute" }} ref={$input} name="listener" />
      {props.children}
    </div>
  )
}

const frameStyle = {
  width: "100%",
  height: "100%",
}

/**
 * Converts a DOM Event object into a string that represents the keybind: Examples: ctrl_c | ctrl_shift_c | w | alt_w | space
 *
 * > This funtion will append as a prefix the strings 'ctrl_', 'shift_', 'alt_', in their respective cases, also the SPACE key is refered as 'space'
 * > Every character is returned in lowercase, even if the shift key is pressed or mayus actived
 *
 * @param {SyntheticEvent} e - Keyboard DOM Event
 * @returns - A string of the corresponding keybind for computable object keys
 */
function keyEvent2String(e) {
  // Parse CTRL, SHIFT and ALT keys as chained
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

  const key = e.key
    .toLowerCase()
    // Rename space key
    .replace(" ", "space")

  // Rename keys

  return `${prefix}${key}`
}
