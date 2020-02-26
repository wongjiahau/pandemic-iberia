import React from 'react';
import { Game } from '../model/game';
import {Tooltip} from 'react-tippy'

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
            <div key={index} style={{display: 'grid', gridAutoFlow: 'column', gridGap: '4px', 
              justifyContent: 'start', alignItems: 'center'}}>
              <div key={index} style={{backgroundColor: card.cityColor, width: '12px', height: '12px'}}/>
              <div>
                {card.cityName}
              </div>
            </div>
          :
            <Tooltip title='Execute epidemic'>
              <div className='shockwave' key={index} style={{fontWeight: 'bold'}} 
                onClick={props.onClickEpidemic}>
                !EPIDEMIC!
              </div>
            </Tooltip>
      ))}
    </div>
  )
}