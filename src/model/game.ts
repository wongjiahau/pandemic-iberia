import { InfectionCard, PlayerCard } from './cards';
import { CityName, City } from './cities';
import { Player } from './player';

export type Game = {
  players: Player[]
  currentPlayer: {
    name: Player['name'],
    turn: 0 | 1 | 2 | 3
  }
  playerPositions: {
    playerName: Player['name'],
    cityName: CityName
  }[]
  playerCards: {
    playerName: Player['name'], 
    cards: PlayerCard[]
  }[]
  outbreakLevel: number
  infectionRateIndex: number
  infectionDeck: InfectionCard[]
  infectionDiscardPile: InfectionCard[]
  playerDeck: PlayerCard[]
  playerDiscardPile: PlayerCard[]
  cities: City[]
  patients: {
    cityName: CityName, 
    cubes: City['color'][]
  }[]
  railRoads: {
    between: [CityName, CityName]
  }[]
  waters: {
    count: number
    affectedCities: CityName[]
  }[]
  hospitals: CityName[]
  researchedDisease: CityName[]
}