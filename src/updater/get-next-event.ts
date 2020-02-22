import { CityName } from '../model/cities';
import { Game } from "../model/game";
import { Player } from '../model/player';
import { Event } from '../model/event';

const keys = <T extends {}>(o: T): (keyof T)[] => {
  return Object.keys(o) as (keyof T)[]
}

export const getNextEvent = ({
  game,
}: {
  game: Game,
}): Event => {
  const overloadedCity = game.infectedCities.find(city => city.patients.length > 3)
  if(overloadedCity) {
    return {
      type: 'outbreak',
      cityName: overloadedCity.cityName
    }
  }
  const playerWithTooManyCards = game.playerCards.find(player => player.cards.length > 7)
  if(playerWithTooManyCards) {
    return {
      type: 'request to discard card',
      playerName: playerWithTooManyCards.playerName
    }
  } 

  return {
    type: 'request action',
    playerName: game.currentPlayer.name
  }
}