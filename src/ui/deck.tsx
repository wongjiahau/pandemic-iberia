import React from 'react';
import { Tooltip } from 'react-tippy';

export const Deck: React.FC<{
  label: string
  cards: any[]
  cardColor: string
  highlight?: {
    tooltip: string
    onClick: () => void
  }
}> = props => {
  const highlight = props.highlight 
    ? (node: React.ReactNode) => <Tooltip title={props.highlight?.tooltip}>{node}</Tooltip>
    : (node: React.ReactNode) => node
  return (
    <div style={{ display: 'grid', gridAutoFlow: 'column', gridGap: '2px', alignItems: 'center', 
      justifyContent: 'start' }}>
      {highlight(
        <div className={props.highlight ? 'shockwave' : undefined} 
          onClick={props.highlight?.onClick}>
          {props.label}
        </div>
      )}
      {props.cards.length}
      {props.cards.map((_, index) => (
        <div key={index} style={{ height: '8px', width: '1px', backgroundColor: props.cardColor }} />
      ))}
    </div>
  )
}