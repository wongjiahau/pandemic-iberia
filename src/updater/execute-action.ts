import { updateArray } from './../util/array';
import { Game, infectionCountMarkers as infectionRateMarkers } from "../model/game";
import { Action } from "../model/action";

export const executeAction = (action: Action) => (game: Game): Game => {
  const updateCurrentPlayer = (): Game['currentPlayer'] => {
    const {currentPlayer} = game
    const currentPlayerIndex = game.players.findIndex(player => player.name === currentPlayer.name)
    const nextPlayer = game.players[(currentPlayerIndex + 1) % game.players.length]
    const {numberOfPerformedActions, drawnPlayerCards, drawnInfectionCards} = currentPlayer
    console.log(numberOfPerformedActions, drawnPlayerCards, drawnInfectionCards)
    if(numberOfPerformedActions < 4) {
      return {
        ...currentPlayer,
        numberOfPerformedActions: numberOfPerformedActions + 1
      }
    }
    else if(numberOfPerformedActions === 4 && !drawnPlayerCards) {
      return {
        ...currentPlayer,
        drawnPlayerCards: true
      }
    }
    else if(numberOfPerformedActions === 4 && drawnPlayerCards && !drawnInfectionCards) {
      return {
        name: nextPlayer.name,
        numberOfPerformedActions: 0
      }
    }
    else {
      console.log(game)
      throw new Error(`Shouldn't reach here. The game state is as above.`)
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
        currentPlayer: updateCurrentPlayer(),
        playerDeck: game.playerDeck.slice(2),
        playerCards: updateArray({
          array: game.playerCards,
          match: playerCard => playerCard.playerName === action.playerName,
          update: playerCard => ({...playerCard, cards: [...playerCard.cards, ...game.playerDeck.slice(0, 2)]}),
          upsert: undefined
        })
      }
    }
    case 'draw infection cards': {
      const count = infectionRateMarkers[game.infectionRateIndex]
      const infectionCards = game.infectionDeck.slice(0, count)
      return executeActions(infectionCards.map<Action>(infectionCard => {
        return {
          type: 'infect cities',
          cityName: infectionCard.cityName,
          cubes: [infectionCard.cityColor]
        }
      }))({
        ...game,
        currentPlayer: updateCurrentPlayer(),
        infectionDeck: game.infectionDeck.slice(count),
        infectionDiscardPile: [...game.infectionDiscardPile, ...infectionCards]
      })
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

export const executeActions = (actions: Action[]) => (game: Game) => {
  return actions.reduce((game, action) => {
    return executeAction(action)(game)
  }, game)
}