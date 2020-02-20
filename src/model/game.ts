import { InfectionCard, PlayerCard } from './cards';
import { CityName, City } from './cities';
import { Player } from './player';

export type Game = {
  players: {
    player: Player
    position: CityName
    cards: []
  }[]
  outbreakLevel: number
  infectionRate: number
  infectionDeck: InfectionCard[]
  infectionDiscardPile: InfectionCard[]
  playerDeck: PlayerCard[]
  playerDiscardPile: PlayerCard[]
  cities: City & {
    cubes: City['color'][]
  }[]
  railRoads: {
    from: City
    to: City
  }[]
  waters: {
    count: number
    affectedCities: CityName[]
  }[]
}