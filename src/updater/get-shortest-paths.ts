import { City, CityName } from "../model/cities"

export type Path = CityName[]
export const getShortestPaths = ({
  cities,
  from,
  to
}: {
  cities: City[],
  from: CityName
  to: CityName
}): Path[] => {
  const fromCity = cities.find(city => city.name === from)
  let paths: Path[] = fromCity?.connectedTo.map(city => [from, city.name]) ?? []
  while(true) {
    const completedPaths = paths.filter(path => lastElement(path) === to)
    if(completedPaths.length > 0) {
      return completedPaths
    }
    else {
      paths = paths
        .map<Path[]>(path => {
          const lastCity = cities.find(city => city.name === lastElement(path))
          return (lastCity?.connectedTo ?? []).map(city => {
            return [...path, city.name]
          })
        })
        .reduce((a, b) => a.concat(b), [])
    }
  }
}

const lastElement = <T>(array: T[]): T | undefined => {
  return array.slice(-1)[0]
}