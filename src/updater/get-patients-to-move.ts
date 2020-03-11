import { CityName } from './../model/cities';
import { PlayerAction } from './../model/player-action';
import { Game } from '../model/game';
import { getShortestPaths, Path } from './get-shortest-paths';

export const getPatientsToMove = ({
  game,
  targetHospital
}: {
  game: Game
  targetHospital: Game['hospitals'][0]
}): PlayerAction[] => {
  const infectedNeighbours = game.infectedCities
    .filter(city => city.patients.includes(targetHospital.cityColor))
    .filter(city => city.cityName !== targetHospital.cityName)

  const routes = infectedNeighbours
    .map(neighbour => ({
      departure: neighbour,
      shortestPaths: getShortestPaths({
        cities: game.cities,
        from: neighbour.cityName,
        to: targetHospital.cityName
      })
    }))
    .filter(route => route.shortestPaths[0].length > 1)

  const shortestDistance = routes.reduce((shortestDistance, route) => 
    route.shortestPaths[0].length < shortestDistance 
      ? route.shortestPaths[0].length
      : shortestDistance, Number.MAX_SAFE_INTEGER)

  return routes
    .filter(route => route.shortestPaths[0].length === shortestDistance)
    .flatMap<PlayerAction>(route => {
      return route.shortestPaths.flatMap(path => {
        const nextStop = getNextStop(game, path)
        if(nextStop) {
          return [{
            type: 'move patient towards hospital',
            from: route.departure.cityName,
            to: nextStop,
            playerName: game.currentPlayer.name,
            patientColor: targetHospital.cityColor
          }]
        }
        else {
          return []
        }
      })
    })
}

const getNextStop = (game: Game, path: Path): CityName | undefined => {
  const pairs = path
    .map((_, index) => {
      return path.slice(index, index + 2)
    })
    .filter(pairs => pairs.length === 2)

  return pairs
    .reduce<CityName | undefined>((nextStop, [from, to], index) => 
      nextStop 
        ? nextStop 
        : game.railRoads.some(({between: [a, b]}) => 
        (from === a && to === b) || (from === b && to === a))
          ? index === pairs.length - 1 ? to : undefined
          : to, undefined)
}