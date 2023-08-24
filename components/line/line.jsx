import scss from "./line.module.scss"

export default function Line(props) {
  return (
    <div className={scss.line}>
      <pre>
        {props.prefix}
        {props.children || " "}
      </pre>
    </div>
  )
}
