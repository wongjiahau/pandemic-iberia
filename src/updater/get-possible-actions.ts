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
  const canBuildRailRoads = (city?.connectedTo ?? []).length < 
    game.railRoads.filter(({between: [a, b]}) => a === city?.name || b === city?.name).length

  const canTreatDisease = 
    (game.infectedCities.find(({cityName}) => cityName === city?.name)?.patients ?? []).length > 0

  return [
    ...(city?.connectedTo ?? []).map<PlayerAction>(neighbour => ({
      type: 'move',
      to: neighbour.name,
      playerName,
      by: 'carriage/boat'
    }))
  ]
  // return [
  //   'move',
  //   ...(canBuildRailRoads ? ['build railroads'] : []) as PlayerAction['type'][],
  //   ...(canTreatDisease ? ['treat disease'] : []) as PlayerAction['type'][],
  // ]
}