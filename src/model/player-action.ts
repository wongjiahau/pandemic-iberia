import { PlayerCard } from './cards';
import { CityName, City } from './cities';
import { Player } from './player';

export type PlayerAction = {
  playerName: Player['name']
} & ({
  type: 'move'
  by:  'carriage/boat' | 'train' | 'ship'
  from: CityName
  to: CityName
} | {
  type: 'build railroads'
  between: [CityName, CityName]
} | {
  type: 'build hospital' | 'treat disease'
  on: CityName
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
})