export default function Color(props) {
  const toHex = (code) => (code ? (code[0] === "#" ? code : `#${code}`) : undefined)
  const color = Object.values(props)[0] === true ? Object.keys(props)[0] : props.color || toHex(props.hex)

  return <span style={{ color }}>{props.children}</span>
}
