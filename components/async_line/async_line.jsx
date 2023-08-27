import { useEffect, useState } from "react"
import Line from "../line/line"
import useGenerator from "../../hooks/use_generator"

export default function AsyncLines(props) {
  const [progress, setProgress] = useState("")

  const iter = useGenerator(function* letterIter(data) {
    const result = []

    function parseData(node) {
      // Is string
      if (typeof node === "string") {
        for (let letter of node) result.push(letter)
      }
      // Is JSX
      else if (node.$$typeof) {
        for (let subnode of node.props.children) {
          result.push(subnode)
          // parseData(subnode)
        }
      }
    }

    parseData(data)
    for (let c of result) yield c
  }, props.children)

  useEffect(() => {
    // Determine the callback to handle the async behaviour

    const stopInterval = setTimeout(
      () => {
        // Get next value from the generator
        const next = iter.next()
        // DEBUG
        // console.log(next)
        // Update line value
        next.value !== undefined && setProgress((old) => old + next.value)
        // Scroll to the bottom
        document.getElementById("terminal-scroll-area").scrollBy(0, 100)
      },
      // Calculate the corresponding interval based on the duration and the delay
      Math.floor(props.duration / props.children?.length) + (progress?.length === 0 ? props.delay : 0)
      // 1000
    )

    // Clean-up
    return () => clearInterval(stopInterval)
  }, [progress])

  return <Line style={props.style}>{progress}</Line>
}
