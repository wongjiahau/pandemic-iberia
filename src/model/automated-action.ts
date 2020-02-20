import { PlayerName } from "./player";
import { City } from "./cities";

export type AutomatedAction = {
  type: 'draw 2 player cards'
  playerName: PlayerName
} | {
  type: 'infect cities'
  cityName: PlayerName
  cubes: City['color'][]
}