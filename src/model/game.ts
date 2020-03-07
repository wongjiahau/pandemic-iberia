import { InfectionCard, PlayerCard } from './cards';
import { CityName, City } from './cities';
import { Player } from './player';

export type Game = {
  players: Player[]
  currentPlayer: {
    name: Player['name'],
    numberOfPerformedActions: number // 0 | 1 | 2 | 3
    drawnPlayerCards?: boolean
    drawnInfectionCards?: boolean
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
  infectedCities: {
    cityName: CityName,
    patients: City['color'][]
  }[]
  railRoads: {
    between: [CityName, CityName]
  }[]
  waters: {
    count: number
    affectedCities: CityName[]
  }[]
  hospitals: {
    cityName: CityName,
    cityColor: City['color']
  }[]
  researchedDisease: City['color'][]
  drawnInfectionCards: InfectionCard[]
  currentOutbreakedCities: CityName[]
}

export const infectionCountMarkers = [2, 2, 2, 3, 3, 4, 4]