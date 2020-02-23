import React from 'react';

export const Tracker: React.FC<{
  label: string
  focusedIndex: number
  levels: string[]
}> = props => {
  return (
    <div style={{ display: 'grid', gridAutoFlow: 'column', gridGap: '12px' }}>
      <div>{props.label}</div>
      {props.levels.map((rate, index) =>
        <div key={index} style={{
          width: '18px',
          height: '18px',
          display: 'grid',
          alignItems: 'center',
          justifyItems: 'center',
          border: props.focusedIndex === index ? '1px solid black' : undefined,
          borderRadius: props.focusedIndex === index ? '18px' : undefined
        }}>
          {rate}
        </div>
      )}
    </div>
  )
}