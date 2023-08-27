import { useCallback, useState } from "react"

export default function useGenerator(gen, params) {
  const getIter = useCallback(gen, [])
  const [iter, _] = useState(getIter(params))

  return iter
}
