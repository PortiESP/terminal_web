import { useRef } from "react"

export default function useKBDListener() {
  return {
    ListenerProvider,
  }
}

function ListenerProvider(props) {
  const $input = useRef(null)
  return (
    <div onKeyDown={props.callback} onClick={() => $input.current.focus()} style={frameStyle}>
      <input autoFocus style={{ opacity: 0, position: "absolute" }} ref={$input} name="listener" />
      {props.children}
    </div>
  )
}

const frameStyle = {
  width: "100%",
  height: "100%",
}
