/**
 * This component is used to apply color to the wrapped content
 *
 * The color can be determined in two ways (do not use both of them in the same tag)
 *  - By the `hex` prop
 *  - By the color CSS name as the prop name
 *
 * @param {String} props.hex - Color in HEX format (the '#' is optional)
 * @param {Object.Key} props.* - Color by prop name
 */
export default function Color(props) {
  const toHex = (code) => (code ? (code[0] === "#" ? code : `#${code}`) : undefined)
  const color = Object.values(props)[0] === true ? Object.keys(props)[0] : props.color || toHex(props.hex)

  return <span style={{ color }}>{props.children}</span>
}

/* EXAMPLEs

  <Color red>Exmaple text</Color>
  <Color aqua>Exmaple text</Color>
  <Color hex="#ffffff">Exmaple text</Color>
  <Color hex="ffffff">Exmaple text</Color>

*/
