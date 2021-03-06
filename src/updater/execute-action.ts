import { updateArray } from './../util/array';
import { Game, infectionCountMarkers as infectionRateMarkers } from "../model/game";
import { Action } from "../model/action";
import shuffle from 'shuffle-array';
import { City, CityName } from '../model/cities';

export const executeAction = (action: Action) => (game: Game): Game => {
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
    else if (!drawnPlayerCards) {
      return {
        ...currentPlayer,
        drawnPlayerCards: true
      }
    }
    else if (!drawnInfectionCards) {
      return {
        name: nextPlayer.name,
        numberOfPerformedActions: 0,
        movedPatientColors: []
      }
    }
    else {
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
        currentPlayer: action.dontUpdatePlayerTurn 
          ? game.currentPlayer 
          : updateCurrentPlayer(),
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
    case 'move patient': {
      const remaningPatientInOverranHospital = game.infectedCities
        .find(city => city.cityName === game.overrunHospital?.cityName)
      
      return executeActions([
        {
          type: 'treat disease' as 'treat disease', 
          on: action.from,
          playerName: game.currentPlayer.name,
          dontUpdatePlayerTurn: true
        },
        {
          type: 'infect cities' as 'infect cities', 
          cityName: action.to,
          cubes: [action.patientColor],
          affectedByPurifyWater: false
        }
      ])({
        ...game,
        currentPlayer: {
          ...game.currentPlayer,
          movedPatientColors: [
            ...game.currentPlayer.movedPatientColors,
            action.patientColor
          ]
        },
        overrunHospital: 
          (remaningPatientInOverranHospital?.patients.length ?? 0) === 1
            ? undefined
            : game.overrunHospital
      })
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
          cubes: [infectionCard.cityColor],
          affectedByPurifyWater: true
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
    case 'purify water': {
      return executeAction$({
        type: 'discard a card',
        playerName: game.currentPlayer.name,
        cardName: action.discardedCityCard
      })({
        ...game,
        currentPlayer: updateCurrentPlayer(),
        waters: [
          ...game.waters,
          {
            affectedCities: action.affectedCities,
            count: 2
          }
        ]
      })
    }
    case 'infect cities': {
      const targetCity = game.infectedCities.find(city => city.cityName === action.cityName)
      const relatedWater = game.waters
        .find(water => water.affectedCities.includes(action.cityName) && water.count > 0)

      if(action.affectedByPurifyWater && relatedWater && action.cubes.length > 0) {
        return executeAction$({
          type: 'infect cities',
          cityName: action.cityName,
          cubes: action.cubes.slice(1),
          affectedByPurifyWater: true
        })({
          ...game,
          waters: updateArray({
            array: game.waters,
            match: water => 
              getRegionId(water.affectedCities) 
              === getRegionId(relatedWater.affectedCities),
            update: water => ({...water, count: water.count -1}),
            upsert: undefined
          })
        })
      }

      const hasHospital = game.hospitals
        .some(hospital => hospital.cityName === targetCity?.cityName)

      const crowded = (targetCity?.patients.length ?? 0) === 3
      if(crowded && hasHospital && action.cubes.length > 0) {
        return executeAction$({
          type: 'overrun hospital',
          cityName: action.cityName,
          patientColor: action.cubes[0]
        })(game)
      }
      else if(crowded && !hasHospital && action.cubes.length > 0) {
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
    case 'overrun hospital': {
      return {
        ...game,
        infectedCities: updateArray({
          array: game.infectedCities,
          match: city => city.cityName === action.cityName,
          update: city => ({...city, patients: [...city.patients, action.patientColor]}),
          upsert: undefined
        }),
        overrunHospital: {
          cityName: action.cityName,
        },
        outbreakLevel: game.outbreakLevel + 1
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
          cityName: lastCard.cityName,
          affectedByPurifyWater: true
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
        // alert(`Outbreak at ${targetCity?.name}`)
        return executeActions(targetCity.connectedTo
          .map<Action>(neighbour => ({
            type: 'infect cities',
            cubes: [targetCity.color],
            cityName: neighbour.name,
            affectedByPurifyWater: true
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
            ({playerName, cards: cards.filter(
              card => !(card.type === 'city' && card.cityName === action.cardName))}),
          upsert: undefined
        })
      }
    case 'share knowledge':
      const updatedGame = 
        executeAction$({
          type: 'discard a card',
          playerName: action.from,
          cardName: action.cityName
        })(game)

      return {
        ...updatedGame,
        currentPlayer: updateCurrentPlayer(),
        playerCards: updateArray({
          array: updatedGame.playerCards,
          match: ({playerName}) => action.to === playerName,
          update: ({playerName, cards}) =>
            ({playerName, cards: [...cards, 
              {type: 'city' as 'city', cityName: action.cityName, cityColor: action.cityColor}]}),
          upsert: undefined
        })
      }
    default:
      alert(JSON.stringify(action, null, 2))
      throw new Error(`Cannot handle ${action.type} yet`)
  }
}

export const executeActions = (actions: Action[]) => (game: Game) => {
  return actions.reduce((game, action) => {
    return executeAction$(action)(game)
  }, game)
}

export const getRegionId = (cityNames: CityName[]): string => {
  return cityNames.slice().sort().join('/')
}