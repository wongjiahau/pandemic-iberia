import React from 'react';
import { Game } from '../model/game';
import {Tooltip} from 'react-tippy'
import { CityCard } from './city-card';

export const PlayerCardsInfo: React.FC<{
  playerCards: Game['playerCards'][0],
  onClickEpidemic: () => void
}> = props => {
  return (
    <div style={{display: 'grid', alignContent: 'start', gridGap: '4px'}}>
      <div style={{fontWeight: 'bold'}}>
        {props.playerCards.playerName}
      </div>
      {props.playerCards.cards.map((card, index) => (
        card.type === 'city' 
          ?
            <CityCard key={index} cityColor={card.cityColor} cityName={card.cityName}/>
          :
            <Tooltip title='Execute epidemic' key={index}>
              <div className='shockwave' style={{fontWeight: 'bold'}} 
                onClick={props.onClickEpidemic}>
                !EPIDEMIC!
              </div>
            </Tooltip>
      ))}
    </div>
  )
}