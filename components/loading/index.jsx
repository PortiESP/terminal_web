import { useEffect, useState } from "react"

export default function LoadingFallback() {
  const [dots, setDots] = useState("")

  useEffect(() => {
    const interval = setInterval(() => setDots((old) => ".".repeat((old.length + 1) % 4)), 400)
    return () => clearInterval(interval)
  })

  return (
    <div style={styles}>
      <div style={{ width: "10px" }}>
        <span>Loading{dots}</span>
      </div>
    </div>
  )
}

const styles = {
  color: "white",
  display: "flex",
  justifyContent: "center",
  height: "100%",
  alignItems: "center",
}
