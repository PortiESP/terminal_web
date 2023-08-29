import { useEffect, useState } from "react"

const MOBILE_MAX_WIDTH = 800

/**
 * This hook allows us to check if a user is visiting the size from a mobile device
 *
 * @returns {Object.Boolean} isMobile - True for mobile users
 * @returns {Object.Component} MobileRender - A component that only renders in mobile users
 */
export default function useMobile() {
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
