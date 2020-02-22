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
        playerCards: {
          ...game.playerCards,
          [action.playerName]: [...(game.playerCards[action.playerName] ?? []), ...game.playerDeck.slice(0, 2)]
        }
      }
    }
    case 'infect cities': {
      return {
        ...game,
        patients: {
          ...game.patients,
          [action.cityName]: [...(game.patients[action.cityName] ?? []), ...action.cubes]
        }
      }
    }
  }
}