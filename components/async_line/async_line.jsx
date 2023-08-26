import { useEffect, useState } from "react"
import scss from "../line/line.module.scss"

export default function AsyncLines(props) {
  const [progress, setProgress] = useState("")

  useEffect(() => {
    const stopInterval = setTimeout(() => {
      setProgress(() => props.children.slice(0, progress.length + 1))
      document.getElementById("terminal-scroll-area").scrollBy(0, 100)
    }, Math.floor(props.duration / props.children?.length) + (progress?.length === 0 ? props.delay : 0))

    return () => clearInterval(stopInterval)
  }, [progress])

  return (
    <div className={scss.line}>
      <pre>{progress}</pre>
    </div>
  )
}
