import { InfectionCard, PlayerCard } from './cards';
import { CityName, City } from './cities';
import { Player } from './player';

export type Game = {
  players: Player[]
  currentPlayer: {
    name: Player['name'],
    numberOfPerformedActions: number // 0 | 1 | 2 | 3
    movedPatientColors: City['color'][]
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
  regions: {
      cities: City[];
      position: {
          column: number;
          row: number;
      };
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
  overrunHospital: {
    cityName: CityName,
  } | undefined
}

export const infectionCountMarkers = [2, 2, 2, 3, 3, 4, 4]