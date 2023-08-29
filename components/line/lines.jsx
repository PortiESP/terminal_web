import Line from "./line"

/**
 * Define multiple lines in a single element
 *
 * @param {Array} props.lines - List of strings that will be rendered as mutiple lines
 */
export default function Lines(props) {
  return (
    <>
      {props.lines.map((line, i) => (
        <Line key={i} prefix={props.prefix}>
          {line}
        </Line>
      ))}
    </>
  )
}
