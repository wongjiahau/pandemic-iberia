import React from 'react';
import { Game } from '../model/game';

export const PlayerCardsInfo: React.FC<{
  playerCards: Game['playerCards'][0]
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
            undefined
      ))}
    </div>
  )
}