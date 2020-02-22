import { PlayerName } from "./player";
import { City } from "./cities";

export type AutomatedAction = {
  type: 'draw 2 player cards'
  playerName: PlayerName
} | {
  type: 'infect cities'
  cityName: PlayerName
  cubes: City['color'][]
} | {
  type: 'epidemic'
} | {
  type: 'outbreak'
  cityName: City['name']
} | {
  type: 'overrun hospital'
  cityName: City['name']
} | {
  type: 'move patients'
  from: City['name']
  to: City['name']
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
}
