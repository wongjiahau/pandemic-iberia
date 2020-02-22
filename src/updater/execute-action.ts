import { updateArray } from './../util/array';
import { Game } from "../model/game";
import { Action } from "../model/action";

export const executeAction = ({
  game,
  action
}: {
  game: Game,
  action: Action
}): Game => {
  switch(action.type) {
    case 'move': {
      return {
        ...game,
        playerPositions: {
          ...game.playerPositions,
          [action.playerName]: action.to
        }
      }
    }
    case 'build railroads': {
      return {
        ...game,
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