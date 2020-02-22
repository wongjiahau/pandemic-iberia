import { CityName } from '../model/cities';
import { Game } from "../model/game";
import { PlayerName } from '../model/player';
import { Event } from '../model/event';

const keys = <T extends {}>(o: T): (keyof T)[] => {
  return Object.keys(o) as (keyof T)[]
}

export const getNextEvent = ({
  game,
}: {
  game: Game,
}): Event => {
  const cities = keys(game.patients).map(cityName => ({
    cityName, 
    patients: game.patients[cityName as CityName]
  }))
  const overloadedCity = cities.find(city => city.patients.length > 3)
  if(overloadedCity) {
    return {
      type: 'outbreak',
      cityName: overloadedCity.cityName
    }
  }
  const players = keys(game.playerCards).map((playerName: PlayerName) => ({
    playerName,
    cards: game.playerCards[playerName],
  }))
  const playerWithTooManyCards = players.find(player => player.cards.length > 7)
  if(playerWithTooManyCards) {
    return {
      type: 'request to discard card',
      playerName: playerWithTooManyCards.playerName
    }
  } 
}