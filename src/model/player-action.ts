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
  dontUpdatePlayerTurn?: boolean
} | {
  type: 'build hospital',
  city: {
    cityName: CityName,
    cityColor: City['color']
  }
} | {
  type: 'move patient',
  from: CityName
  to: CityName
  patientColor: City['color']
  direction: 'towards hospital' | 'flee from hospital'
} | {
  type: 'share knowledge'
  cityName: CityName
  cityColor: City['color']
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
  cardName: CityName
})