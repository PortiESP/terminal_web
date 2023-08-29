import { useEffect, useState } from "react"
import Line from "../line/line"
import useGenerator from "../../hooks/use_generator"

/**
 * The string wrapped inside will be animated as a string that is being typed
 *
 * Known bugs:
 * - When the content includes nested JSX, the animation is skipped
 *
 * @param {Number} props.duration - Aproximated duration of the typing effect
 * @param {Number} props.delay - Time until the animation starts
 */
export default function AsyncLine(props) {
  const [progress, setProgress] = useState("")

  // Define a generator function that will push to the `result` array each character
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
    // Parse then content to an array
    parseData(data)
    // Generator iteration over the array of characters
    for (let c of result) yield c
  }, props.children)

  // Updated the rendered content
  useEffect(() => {
    // Determine the callback to handle the async behaviour
    const stopInterval = setTimeout(
      () => {
        // Get next value from the generator
        const next = iter.next()

        // console.log(next) // DEBUG

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
