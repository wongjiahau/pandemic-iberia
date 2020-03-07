import React from 'react';
import { Game } from '../model/game';
import {Tooltip} from 'react-tippy'
import { CityCard } from './city-card';

export const PlayerCardsInfo: React.FC<{
  playerCards: Game['playerCards'][0],
  highlightCard: (card: Game['playerCards'][0]['cards'][0], cardIndex: number) => {
    needHighlight: boolean
    tooltip: string
    onClick: () => void
  }
}> = props => {
  return (
    <div style={{display: 'grid', alignContent: 'start', gridGap: '4px'}}>
      <div style={{fontWeight: 'bold'}}>
        {props.playerCards.playerName}
      </div>
      {props.playerCards.cards.map((card, index) => { 
        const {needHighlight, tooltip, onClick} = props.highlightCard(card, index)
        return (
          <Tooltip key={index + needHighlight.toString()} 
            arrow
            open={needHighlight ? undefined : false}
            title={needHighlight ? tooltip : undefined}>
            <div
              className={needHighlight ? 'animated infinite flash' : undefined}
              style={{cursor: needHighlight ? 'pointer' : undefined}}
              onClick={needHighlight ? onClick : undefined}>
              {card.type === 'city'
                ?
                  <CityCard 
                    cityColor={card.cityColor} 
                    cityName={card.cityName}
                    />
                : 
                  <div style={{fontWeight: 'bold'}}> 
                    !EPIDEMIC!
                  </div>}
            </div>
          </Tooltip>
        )
  })}
    </div>
  )
}