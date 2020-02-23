import React from 'react';

export const Deck: React.FC<{
  label: string
  cards: any[]
  cardColor: string
}> = props => {
  return (
    <div style={{ display: 'grid', gridAutoFlow: 'column', gridGap: '2px', alignItems: 'center', 
      justifyContent: 'start' }}>
      <div>{props.label}</div>
      {props.cards.map((_, index) => (
        <div key={index} style={{ height: '8px', width: '1px', backgroundColor: props.cardColor }} />
      ))}
    </div>
  )
}