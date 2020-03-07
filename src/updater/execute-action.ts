import { updateArray } from './../util/array';
import { Game, infectionCountMarkers as infectionRateMarkers } from "../model/game";
import { Action } from "../model/action";
import shuffle from 'shuffle-array';
import { City } from '../model/cities';

export const executeAction = (action: Action) => (game: Game): Game => {
  console.log(action)
  const updatedGame = executeAction$(action)(game)
  return cleanUpTemporaryVariables(updatedGame)
}
const cleanUpTemporaryVariables = (game: Game): Game => {
  return {
    ...game,
    currentOutbreakedCities: []
  }
}
export const executeAction$ = (action: Action) => (game: Game): Game => {
  const updateCurrentPlayer = (): Game['currentPlayer'] => {
    const { currentPlayer } = game
    const currentPlayerIndex = game.players.findIndex(player => player.name === currentPlayer.name)
    const nextPlayer = game.players[(currentPlayerIndex + 1) % game.players.length]
    const { numberOfPerformedActions, drawnPlayerCards, drawnInfectionCards } = currentPlayer
    if (numberOfPerformedActions < 4) {
      return {
        ...currentPlayer,
        numberOfPerformedActions: numberOfPerformedActions + 1
      }
    }
    else if (numberOfPerformedActions === 4 && !drawnPlayerCards) {
      return {
        ...currentPlayer,
        drawnPlayerCards: true
      }
    }
    else if (numberOfPerformedActions === 4 && drawnPlayerCards && !drawnInfectionCards) {
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
  switch (action.type) {
    case 'set starting position':
      return {
        ...game,
        playerPositions: [...game.playerPositions, { playerName: action.playerName, cityName: action.cityName }]
      }
    case 'move': {
      return {
        ...game,
        currentPlayer: updateCurrentPlayer(),
        playerPositions: updateArray({
          array: game.playerPositions,
          match: position => position.playerName === action.playerName,
          update: position => ({ ...position, cityName: action.to }),
          upsert: undefined
        }),
        playerCards: updateArray({
          array: game.playerCards,
          match: ({playerName}) => action.by === 'ship' 
            ? playerName === game.currentPlayer.name
            : false,
          update: ({playerName, cards}) => ({
            playerName,
            cards: cards.filter(card => !(card.type === 'city' && card.cityName === action.to))
          }),
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
          update: city => ({ ...city, patients: city.patients.slice(1) }),
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
          { between: action.between }
        ]
      }
    }
    case 'build hospital': {
      return {
        ...game,
        currentPlayer: updateCurrentPlayer(),
        playerCards: updateArray({
          array: game.playerCards,
          match: ({playerName}) => playerName === action.playerName,
          update: ({playerName, cards}) => ({
            playerName,
            cards: cards.filter(card => 
              !(card.type === 'city' && card.cityName === action.city.cityName)) 
          }),
          upsert: undefined
        }),
        hospitals: [
          ...game.hospitals.filter(city => city.cityColor !== action.city.cityColor),
          action.city
        ]
      }
    }
    case 'move patient towards hospital': {
      return executeActions([
        {
          type: 'treat disease' as 'treat disease', 
          on: action.from,
          playerName: game.currentPlayer.name
        },
        {
          type: 'infect cities' as 'infect cities', 
          cityName: action.to,
          cubes: [action.patientColor]
        }
      ])(game)
    }
    case 'research disease': {
      return {
        ...game,
        currentPlayer: updateCurrentPlayer(),
        researchedDisease: [
          ...game.researchedDisease,
          action.color
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
          update: playerCard => ({ ...playerCard, cards: [...playerCard.cards, ...game.playerDeck.slice(0, 2)] }),
          upsert: undefined
        })
      }
    }
    case 'use drawn infection cards': {
      const infectionCards = game.drawnInfectionCards
      return executeActions(infectionCards.map<Action>(infectionCard => {
        return {
          type: 'infect cities',
          cityName: infectionCard.cityName,
          cubes: [infectionCard.cityColor]
        }
      }))({
        ...game,
        currentPlayer: updateCurrentPlayer(),
        infectionDiscardPile: [...game.infectionDiscardPile, ...infectionCards],
        drawnInfectionCards: []
      })
    }
    case 'draw infection cards': {
      const count = infectionRateMarkers[game.infectionRateIndex]
      const infectionCards = game.infectionDeck.slice(0, count)
      return {
        ...game,
        infectionDeck: game.infectionDeck.slice(count),
        drawnInfectionCards: infectionCards
      }
    }
    case 'infect cities': {
      const targetCity = game.infectedCities.find(city => city.cityName === action.cityName)
      if((targetCity?.patients.length ?? 0) === 3) {
        return executeAction$({
          type: 'outbreak',
          cityName: action.cityName,
          playerName: game.currentPlayer.name
        })(game)
      }
      else {
        return {
          ...game,
          infectedCities: updateArray({
            array: game.infectedCities,
            match: ({cityName}) => cityName === action.cityName,
            update: ({cityName, patients}) => 
              ({ cityName, patients: [...patients, ...action.cubes] }),
            upsert: { cityName: action.cityName, patients: action.cubes }
          })
        }
      }
    }
    case 'epidemic': {
      const lastCard = game.infectionDeck.slice(-1)[0]
      const updatedGame: Game = {
        ...game,
        infectionRateIndex: game.infectionRateIndex + 1,
        infectionDeck: [
          ...(shuffle([...game.infectionDiscardPile, lastCard])),
          ...game.infectionDeck.slice(0, game.infectionDeck.length - 1)
        ],
        infectionDiscardPile: [],
        playerCards: updateArray({
          array: game.playerCards,
          match: playerCard => playerCard.playerName === game.currentPlayer.name,
          update: playerCard => ({
            ...playerCard, 
            cards: playerCard.cards.filter(card => card.type !== 'epidemic')
          }),
          upsert: undefined
        }),
        playerDiscardPile: [...game.playerDiscardPile, {type: 'epidemic'}]
      }

      const targetCity = game.infectedCities.find(city => city.cityName === lastCard.cityName)
      if (targetCity && targetCity.patients.length > 0) {
        return executeAction$({
          type: 'outbreak',
          cityName: targetCity.cityName,
          playerName: game.currentPlayer.name,
        })(updatedGame)
      }
      else {
        return executeAction$({
          type: 'infect cities',
          cubes: new Array<City['color']>(3).fill(lastCard.cityColor),
          cityName: lastCard.cityName
        })(updatedGame)
      }
    }
    case 'outbreak': {
      const targetCity = game.cities.find(city => city.name === action.cityName)
      if(!targetCity) {
        throw new Error(`targetCity is undefined for cityName of ${action.cityName}`)
      }
      else if(game.currentOutbreakedCities.includes(targetCity.name)) {
        // Don't outbreak again
        return game
      }
      else {
        alert(`Outbreak at ${targetCity?.name}`)
        return executeActions(targetCity.connectedTo
          .map<Action>(neighbour => ({
            type: 'infect cities',
            cubes: [targetCity.color],
            cityName: neighbour.name
          })))({
            ...game,
            outbreakLevel: game.outbreakLevel + 1,
            currentOutbreakedCities: [...game.currentOutbreakedCities, targetCity.name]
          })
      }
    }
    case 'discard a card':
      return {
        ...game,
        playerCards: updateArray({
          array: game.playerCards,
          match: ({playerName}) => action.playerName === playerName,
          update: ({playerName, cards}) => 
            ({playerName, cards: cards.filter((_, index) => index !== action.cardIndex)}),
          upsert: undefined
        })
      }
    default:
      throw new Error(`Cannot handle ${action.type} yet`)
  }
}

export const executeActions = (actions: Action[]) => (game: Game) => {
  return actions.reduce((game, action) => {
    return executeAction$(action)(game)
  }, game)
}