import { PlayerAction } from '../model/player-action';
import { City, CityName } from './../model/cities';
import { Game } from './../model/game';

export const getPossibleActions = ({
  game
}: {
  game: Game
}): PlayerAction[] => {
  if(game.playerDeck.length === 0) {
    return [{
      type: 'game ended',
      playerName: game.currentPlayer.name,
      reason: {
        type: 'player deck exhausted'
      }
    }]
  }

  if(game.outbreakLevel >= 7) {
    return [{
      type: 'game ended',
      playerName: game.currentPlayer.name,
      reason: {
        type: 'max outbreak reached'
      }
    }]
  }

  const patients = game.infectedCities.flatMap(city => city.patients)
  const overloadedDisease = ([ 'yellow', 'red', 'blue', 'black' ] as City['color'][])
    .find(color => patients.filter(patient => patient === color).length > 24)

  if(overloadedDisease) {
    return [{
      type: 'game ended',
      playerName: game.currentPlayer.name,
      reason: {
        type: 'patient cube ran out',
        color: overloadedDisease
      }
    }]
  }

  const playerWithTooManyCards = game.playerCards.find(player => player.cards.length > 7)
  if(playerWithTooManyCards) {
    return playerWithTooManyCards.cards.map((_card, index) => ({
      type: 'discard a card',
      playerName: playerWithTooManyCards.playerName,
      cardIndex: index
    }))
  } 

  const {currentPlayer} = game
  const playerName = currentPlayer.name
  const currentPlayerPosition = game.playerPositions.find(position => position.playerName === currentPlayer.name)

  if(game.drawnInfectionCards.length > 0) {
    return [{
      type: 'use drawn infection cards',
      playerName: currentPlayer.name
    }]
  }

  if(game.playerCards.flatMap(({cards}) => cards).some(card => card.type === 'epidemic')) {
    return [{
      type: 'epidemic',
      playerName: currentPlayer.name
    }]
  }
  if(!currentPlayerPosition) {
    return game.playerCards
      .find(playerCards => playerCards.playerName === currentPlayer.name)?.cards
      .flatMap(card => card.type === 'city' ? [card.cityName] : [])
      .map(cityName => {
        return {
          type: 'set starting position',
          playerName,
          cityName
        } as PlayerAction
      }) ?? []
  }

  if(currentPlayer.numberOfPerformedActions === 4 && !currentPlayer.drawnPlayerCards) {
    return [{
      type: 'draw 2 player cards',
      playerName: currentPlayer.name
    }]
  }

  if(currentPlayer.numberOfPerformedActions === 4 && currentPlayer.drawnPlayerCards 
      && !currentPlayer.drawnInfectionCards) {
    return [{
      type: 'draw infection cards',
      playerName: currentPlayer.name
    }]
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

  const canBuildRailRoads = game.railRoads.length < 20 &&
    builtRailRoads.length < (city?.connectedTo ?? []).length

  const canTreatDisease = 
    (game.infectedCities.find(({cityName}) => cityName === city?.name)?.patients ?? []).length > 0

  const possibleDestinationsViaRailway = 
    city
      ? findPossibleDestinationsViaRailways({
          city,
          railRoads: game.railRoads,
          allCities: game.cities
        })
        .filter(cityName => cityName !== city.name)
      : []
  return [
    ...(city?.connectedTo ?? []).map<PlayerAction>(neighbour => ({
      type: 'move',
      to: neighbour.name,
      playerName,
      by: 'carriage/boat'
    })),
    ...possibleDestinationsViaRailway.map<PlayerAction>(destination => ({
      type: 'move',
      to: destination,
      playerName,
      by: 'train'
    })),
    ...(canTreatDisease && city ? [{
      type: 'treat disease' as 'treat disease',
      playerName,
      on: city.name
    }] : []),
    ...(canBuildRailRoads ? possbleRailRoadsSpace.map(between => ({
      type: 'build railroads' as 'build railroads',
      playerName,
      between
    })) : [])
  ]
}

const findPossibleDestinationsViaRailways = ({
  city,
  railRoads,
  allCities
}: {
  city: City,
  railRoads: Game['railRoads'],
  allCities: City[]
}): CityName[] => {
  return findPossibleDestinationsViaRailways$({
    city,
    railRoads,
    allCities,
    foundDestinations: [],
    searchedDestinations: []
  })
}

const findPossibleDestinationsViaRailways$ = ({
  city,
  railRoads,
  allCities,
  foundDestinations,
  searchedDestinations
}: {
  city: City,
  railRoads: Game['railRoads'],
  allCities: City[],
  foundDestinations: CityName[]
  searchedDestinations: CityName[]
}): CityName[] => {
  const possibleDestinations = 
    city.connectedTo
      .filter(neighbour => railRoads
        .some(({between: [a, b]}) => 
          (a === neighbour.name && b === city.name)
            ||
          (b === neighbour.name && a === city.name)
        ))
      .map(({name}) => name)

  return possibleDestinations
    .reduce<CityName[]>((destinations, cityName) => {
      if(searchedDestinations.includes(cityName)) {
        return destinations
      }
      else {
        const city = allCities.find(({name}) => cityName === name)
        if(!city) {
          return destinations
        }
        else {
          return [
            ...destinations,
            ...findPossibleDestinationsViaRailways$({
              city,
              railRoads,
              allCities,
              foundDestinations: destinations,
              searchedDestinations: [...searchedDestinations, city.name]
            })
          ]
        }
      }
    }, [...possibleDestinations, ...foundDestinations] as CityName[])
    .filter((destination, index, destinations) => index === destinations.indexOf(destination))
}