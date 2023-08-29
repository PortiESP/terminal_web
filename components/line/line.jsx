import scss from "./line.module.scss"

/**
 * Render a string with terminal style
 *
 * @param {String} props.prefix - A string that must be placed before the content with a different color
 * @param {String} props.children - Content of the line
 * @returns
 */
export default function Line(props) {
  return (
    <div className={scss.line}>
      <pre style={props.style}>
        {props.prefix}
        {props.children || " "}
      </pre>
    </div>
  )
}
