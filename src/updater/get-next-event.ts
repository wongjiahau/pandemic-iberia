import { CityName } from '../model/cities';
import { Game } from "../model/game";
import { Player } from '../model/player';
import { GameEvent } from '../model/game-event';

const keys = <T extends {}>(o: T): (keyof T)[] => {
  return Object.keys(o) as (keyof T)[]
}

export const getNextEvent = ({
  game,
}: {
  game: Game,
}): GameEvent => {
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
      type: 'discard a card',
      playerName: playerWithTooManyCards.playerName
    }
  } 

  return {
    type: 'choose an action',
    playerName: game.currentPlayer.name
  }
}