import { useEffect, useState } from "react"
import scss from "./line.module.scss"

export default function DelayedLine(props) {
  const [progress, setProgress] = useState("")

  useEffect(() => {
    const stopInterval = setTimeout(() => {
      setProgress(() => props.children.slice(0, progress.length + 1))
    }, (1 / props.hz || 100) + (progress.length === 0 ? props.delay : 0))

    return () => clearInterval(stopInterval)
  }, [progress])

  return (
    <div className={scss.line}>
      <pre>{progress}</pre>
    </div>
  )
}
