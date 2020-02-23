import { PlayerCard, InfectionCard } from './cards';
import { Game } from "./game"
import * as shuffle from 'shuffle-array'
import { allPlayers, Player } from "./player"
import { cities } from "./cities"

export const setupGame = (): Game => {
  const players = shuffle.pick(allPlayers, {picks: 4})
  const playerDeck = shuffle.default(cities.map(city => ({
    type: 'city' as 'city',
    cityName: city.name,
    cityColor: city.color
  })))
  const infectionDeck: InfectionCard[] = shuffle.default(cities.map(city => ({
    type: 'infection' as 'infection',
    cityName: city.name,
    cityColor: city.color
  })))

  const {remainingPlayerCards, playerCards} = players.reduce<{
    remainingPlayerCards: PlayerCard[],
    playerCards: Game['playerCards']
  }>(({ remainingPlayerCards: remainingCards, playerCards }, player) => {
    return {
      remainingPlayerCards: remainingCards.slice(2),
      playerCards: [
        ...playerCards,
        {
          playerName: player.name, 
          cards: remainingCards.slice(0, 2)
        }
      ]
    }
  }, { remainingPlayerCards: playerDeck, playerCards: []})

  const numberOfEpidemicsCard = 5

  const portionSize = remainingPlayerCards.length / numberOfEpidemicsCard
  const remaningPlayerCardsWithEpidemicCards = new Array(numberOfEpidemicsCard).fill(0).reduce<PlayerCard[]>((result, index) => {
    return [
      ...result,
      ...index === remainingPlayerCards.length - 1
        ? remainingPlayerCards.slice(index * portionSize)
        : remainingPlayerCards.slice(index * portionSize, portionSize),
      {type: 'epidemic'}
    ]
  }, [])

  const first3InfectionCards = infectionDeck.slice(0, 3)
  const second3InfectionCards = infectionDeck.slice(3, 6)
  const third3InfectionCards = infectionDeck.slice(6, 9)
  const remainingInfectionCards = infectionDeck.slice(9)

  const getPatient = (numberOfCubes: number) => (infectionCard: InfectionCard): Game['infectedCities'][0] => {
    return {
      cityName: infectionCard.cityName,
      patients: new Array(numberOfCubes).fill(0)
        .map(() => infectionCard.cityColor)
    }
  }
  return {
    players,
    currentPlayer: {
      name: players[0]?.name,
      turn: 0
    },
    playerPositions: [],
    playerCards, 
    outbreakLevel: 0,
    infectionRateIndex: 0,
    infectionDeck: remainingInfectionCards,
    infectionDiscardPile: [
      ...first3InfectionCards,
      ...second3InfectionCards,
      ...third3InfectionCards
    ],
    playerDeck: remaningPlayerCardsWithEpidemicCards,
    playerDiscardPile: [],
    cities,
    infectedCities: [
      ...first3InfectionCards.map(getPatient(3)),
      ...second3InfectionCards.map(getPatient(2)),
      ...third3InfectionCards.map(getPatient(1))
    ],
    railRoads: [],
    waters: [],
    hospitals: [],
    researchedDisease: []
  }
}