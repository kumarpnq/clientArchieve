export default function If(props) {
  const { condition, so, otherwise } = props

  return condition ? so : otherwise
}
