import Line from "./line"

export default function Lines(props) {
  return (
    <>
      {props.lines.map((line, i) => (
        <Line key={i} prefix={line.prefix}>
          {line.input}
        </Line>
      ))}
    </>
  )
}
