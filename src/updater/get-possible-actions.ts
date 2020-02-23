import { CityName } from './../model/cities';
import { Game } from './../model/game';
import { Player } from './../model/player';
import { PlayerAction } from '../model/player-action';

export const getPossibleActions = ({
  game
}: {
  game: Game
}): PlayerAction[] => {
  const playerName = game.currentPlayer.name
  const currentPlayerPosition = game.playerPositions.find(position => position.playerName === game.currentPlayer.name)
  if(!currentPlayerPosition) {
    return game.playerCards
      .find(playerCards => playerCards.playerName === game.currentPlayer.name)?.cards
      .flatMap(card => card.type === 'city' ? [card.cityName] : [])
      .map(cityName => {
        return {
          type: 'set starting position',
          playerName,
          cityName
        } as PlayerAction
      }) ?? []
  }

  const playerPosition = game.playerPositions.find(position => position.playerName === playerName)
  const city = game.cities.find(city => city.name === playerPosition?.cityName)

  const builtRailRoads = game.railRoads.filter(({between: [a, b]}) => a === city?.name || b === city?.name)
  const possbleRailRoadsSpace = city 
    ? city.connectedTo
      .filter(neighbour => !neighbour.cannotBuildRailRoad)
      .filter(neighbour => !builtRailRoads
        .some(({between: [a, b]}) => a === neighbour.name || b === neighbour.name))
      .map(neighbour => [city.name, neighbour.name] as [CityName, CityName])
    : []

  const canTreatDisease = 
    (game.infectedCities.find(({cityName}) => cityName === city?.name)?.patients ?? []).length > 0

  return [
    ...(city?.connectedTo ?? []).map<PlayerAction>(neighbour => ({
      type: 'move',
      to: neighbour.name,
      playerName,
      by: 'carriage/boat'
    })),
    ...(canTreatDisease && city ? [{
      type: 'treat disease' as 'treat disease',
      playerName,
      on: city.name
    }] : []),
    ...possbleRailRoadsSpace.map(between => ({
      type: 'build railroads' as 'build railroads',
      playerName,
      between
    }))
  ]
}