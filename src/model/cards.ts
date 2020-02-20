import { CityName } from './cities';

export type InfectionCard = {
  type: 'infection'
  cityName: CityName
} | {

}

export type PlayerCard = {
  type: 'city'
  cityName: CityName
} | {
  type: 'epidemic'
}

