import { PlayerAction } from './../model/player-action';
import { Game } from '../model/game';
import { getShortestPaths } from './get-shortest-paths';

export const getPatientsToMove = ({
  game,
  targetHospital
}: {
  game: Game
  targetHospital: Game['hospitals'][0]
}): PlayerAction[] => {
  const infectedNeighbours = game.infectedCities
    .filter(city => city.patients.includes(targetHospital.cityColor))

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
        const nextStop = path[1] // Implement getNextStop
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
