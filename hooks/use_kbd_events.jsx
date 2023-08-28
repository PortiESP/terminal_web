import { useRef } from "react"

export default function useKBDListener() {
  return {
    ListenerProvider,
  }
}

function ListenerProvider(props) {
  const $input = useRef(null)
  return (
    <div
      onKeyDown={(event) => {
        const parsedKey = keyEvent2String(event)
        const preventFunc = () => event.preventDefault()
        props.debug && console.log(parsedKey)
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
 * Converts a DOM Event object into a string that represents the keybind: Example: ctrl_c
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
