import React from 'react';
import { Game } from '../model/game';
import {Tooltip} from 'react-tippy'
import { CityCard } from './city-card';

export const PlayerCardsInfo: React.FC<{
  playerCards: Game['playerCards'][0],
  onClickEpidemic: () => void
  discardCard: (cardIndex: number) => void
  needToDiscard: boolean
}> = props => {
  return (
    <div style={{display: 'grid', alignContent: 'start', gridGap: '4px'}}>
      <div style={{fontWeight: 'bold'}}>
        {props.playerCards.playerName}
      </div>
      {props.playerCards.cards.map((card, index) => (
        card.type === 'city' 
          ?
            <Tooltip key={index} 
              open={props.needToDiscard ? undefined : false}
              title={props.needToDiscard ? `Discard ${card.cityName}` : ''}>
              <div
                className={props.needToDiscard ? 'animated infinite flash' : undefined}
                style={{cursor: props.needToDiscard ? 'pointer' : undefined}}
                onClick={
                  props.needToDiscard 
                    ? () => props.discardCard(index) 
                    : () => {}
                }>
                <CityCard 
                  cityColor={card.cityColor} 
                  cityName={card.cityName}
                  />
              </div>
            </Tooltip>
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