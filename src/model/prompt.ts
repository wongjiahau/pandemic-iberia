import { Player } from './player';
import { CityName } from './cities';

export type Prompt = {
  type: 'choose an action'
  playerName: Player['name']
} | {
  type: 'discard a card'
  playerName: Player['name']
} | {
  type: 'move a patient closer to hospital'
  possibleDepartureCities: CityName[]
  destinationCity: CityName[]
}