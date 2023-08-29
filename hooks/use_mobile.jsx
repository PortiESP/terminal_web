import { useEffect, useState } from "react"

const MOBILE_MAX_WIDTH = 800

export default function useMobile(props) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < MOBILE_MAX_WIDTH)

  useEffect(() => {
    const resizeEvent = () => setIsMobile(window.innerWidth < MOBILE_MAX_WIDTH)
    window.addEventListener("resize", resizeEvent)
    return () => window.removeEventListener("resize", resizeEvent)
  }, [])

  return {
    isMobile,
    MobileRender(props) {
      return isMobile ? <>{props.children}</> : undefined
    },
  }
}
