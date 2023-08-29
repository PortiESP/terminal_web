import { useState } from "react"
import scss from "./prompt.module.scss"

export default function MobileInterface({ commands, setInput, handleKeyEvent }) {
  const [active, setActive] = useState(false)

  return (
    <div className={scss.mobile}>
      {active && (
        <div className={scss.mobile__menu}>
          <pre>Suggested commands</pre>
          {commands.map((c) => (
            <span
              key={c}
              className={scss.mobile__menu_cmd}
              onClick={() => {
                setInput(c)
                setActive(false)
              }}
            >
              {"> "}
              {c}
            </span>
          ))}
        </div>
      )}
      <div className={scss.mobile__div_blobs} onClick={(e) => e.stopPropagation()}>
        <span className={scss.mobile__blob} onClick={() => handleKeyEvent("enter")}>
          ENTER
        </span>
        <span
          className={[scss.mobile__blob, active && scss.flag__mobile_active].join(" ")}
          onClick={() => setActive((old) => !old)}
        >
          ...
        </span>
      </div>
    </div>
  )
}
