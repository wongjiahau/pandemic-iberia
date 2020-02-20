import { PlayerName } from './player';
import { CityName, City } from './cities';
export type PlayerAction = {
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
  from: PlayerName
  to: PlayerName
} | {
  type: 'research disease'
  color: City['color']
} | {
  type: 'purify water'
  discardedCityCard: CityName
  affectedCities: CityName[]
}