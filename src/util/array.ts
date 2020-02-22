export const updateArray = <T>({
  array,
  match,
  update,
  upsert
}: {
  array: T[],
  match: (element: T, index: number) => boolean,
  update: (element: T) => T,

  /**
   * Value to be appended to the array if no element return true 
   * for the `match` function
   */
  upsert: T
}): T[] => {
  return [
    ...array.map((element, index) => {
      if(match(element, index)) {
        return update(element)
      }
      else {
        return element
      }
    }),
    ...array.some(match)
      ? []
      : [upsert]
  ]
}