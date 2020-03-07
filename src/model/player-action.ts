import { PlayerCard } from './cards';
import { CityName, City } from './cities';
import { Player } from './player';

export type PlayerAction = {
  playerName: Player['name']
} & ({
  type: 'move'
  by:  'carriage/boat' | 'train' | 'ship'
  to: CityName
} | {
  type: 'build railroads'
  between: [CityName, CityName]
} | {
  type: 'treat disease'
  on: CityName
} | {
  type: 'build hospital',
  city: {
    cityName: CityName,
    cityColor: City['color']
  }
} | {
  type: 'move patient towards hospital',
  from: CityName
  to: CityName
} | {
  type: 'share knowledge'
  on: CityName
  from: Player['name']
  to: Player['name']
} | {
  type: 'research disease'
  color: City['color']
} | {
  type: 'purify water'
  discardedCityCard: CityName
  affectedCities: CityName[]
} | {
  type: 'discard card'
  card: PlayerCard
} | {
  type: 'set starting position',
  cityName: CityName
} | {
  type: 'draw 2 player cards'
} | {
  type: 'draw infection cards'
} | {
  type: 'use drawn infection cards'
} | {
  type: 'epidemic'
} | {
  type: 'outbreak' 
  cityName: City['name']
} | {
  type: 'game ended'
  reason: {
    type: 'max outbreak reached'
  } | {
    type: 'patient cube ran out'
    color: City['color']
  } | {
    type: 'player deck exhausted'
  } | {
    type: 'four diseases cured'
  }
} | {
  type: 'discard a card',
  playerName: Player['name']
  cardIndex: number
})