import { CityName, City } from './cities';

export type InfectionCard = {
  type: 'infection'
  cityName: CityName
  cityColor: City['color']
}

export type PlayerCard = {
  type: 'city'
  cityName: CityName
} | {
  type: 'epidemic'
}

