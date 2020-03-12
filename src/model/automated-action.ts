import { Player } from './player';
import { City } from "./cities";

export type AutomatedAction = {
  type: 'draw 2 player cards'
  playerName: Player['name']
} | {
  type: 'infect cities'
  cityName: City['name']
  cubes: City['color'][]
} | {
  type: 'epidemic'
} | {
  type: 'overrun hospital'
  cityName: City['name']
  patientColor: City['color']
} | {
  type: 'move patients'
  from: City['name']
  to: City['name']
}
