import { updateArray } from './../util/array';
import { Game } from "../model/game";
import { Action } from "../model/action";

export const executeAction = (action: Action) => (game: Game): Game => {
  const updateCurrentPlayer = (): Game['currentPlayer'] => {
    const currentPlayerIndex = game.players.findIndex(player => player.name === game.currentPlayer.name)
    const nextPlayer = game.players[(currentPlayerIndex + 1) % game.players.length]
    return game.currentPlayer.turn === 3
      ? {
        name: nextPlayer.name,
        turn: 0
      }
      : {
        ...game.currentPlayer,
        turn: game.currentPlayer.turn + 1
      }
  }
  switch(action.type) {
    case 'set starting position':
      return {
        ...game,
        playerPositions: [...game.playerPositions, {playerName: action.playerName, cityName: action.cityName}]
      }
    case 'move': {
      return {
        ...game,
        currentPlayer: updateCurrentPlayer(),
        playerPositions: updateArray({
          array: game.playerPositions,
          match: position => position.playerName === action.playerName,
          update: position => ({...position, cityName: action.to}),
          upsert: undefined
        })
      }
    }
    case 'treat disease': {
      return {
        ...game,
        currentPlayer: updateCurrentPlayer(),
        infectedCities: updateArray({
          array: game.infectedCities,
          match: city => city.cityName === action.on,
          update: city => ({...city, patients: city.patients.slice(1)}),
          upsert: undefined
        })
      }
    }
    case 'build railroads': {
      return {
        ...game,
        currentPlayer: updateCurrentPlayer(),
        railRoads: [
          ...game.railRoads,
          {between: action.between}
        ]
      }
    }
    case 'build hospital': {
      return {
        ...game,
        hospitals: [
          ...game.hospitals,
          action.on
        ]
      }
    }
    case 'draw 2 player cards': {
      return {
        ...game,
        playerDeck: game.playerDeck.slice(2),
        playerCards: updateArray({
          array: game.playerCards,
          match: playerCard => playerCard.playerName === action.playerName,
          update: playerCard => ({...playerCard, cards: [...playerCard.cards, ...game.playerDeck.slice(0, 2)]}),
          upsert: undefined
        })
      }
    }
    case 'infect cities': {
      return {
        ...game,
        infectedCities: updateArray({
          array: game.infectedCities,
          match: patient => patient.cityName === action.cityName,
          update: patient => ({...patient, cubes: [...action.cubes]}),
          upsert: {cityName: action.cityName, patients: action.cubes}
        })
      }
    }
    default:
      throw new Error(`Cannot handle ${action.type} yet`)
  }
}