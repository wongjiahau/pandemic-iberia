import { Player } from './player';
import { CityName } from './cities';

export type Prompt = {
  type: 'request action'
  playerName: Player['name']
} | {
  type: 'request to discard card'
  playerName: Player['name']
} | {
  type: 'request to move patient'
  possibleDepartureCities: CityName[]
  destinationCity: CityName[]
}