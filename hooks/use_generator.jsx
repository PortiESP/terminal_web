import { useCallback, useState } from "react"

/**
 * This hook will return the a generator object as a state based on a generator function
 *
 * @param {Generator} gen - Generator function
 * @param {Array} params - The list of arguments that we want to pass to the generator function
 * @returns
 */
export default function useGenerator(gen, params) {
  const getIter = useCallback(gen, [])
  const [iter, _] = useState(getIter(params))

  return iter
}
