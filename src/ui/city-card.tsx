import React from 'react';
import { City } from '../model/cities';

export const CityCard: React.FC<{
  cityColor: City['color']
  cityName: City['name']
  className?: string
}> = props => {
  return (
    <div className={props.className} style={{
      display: 'grid', gridAutoFlow: 'column', gridGap: '4px',
      justifyContent: 'start', alignItems: 'center'
    }}>
      <div style={{ backgroundColor: props.cityColor, width: '12px', height: '12px' }} />
      <div>
        {props.cityName}
      </div>
    </div>
  )
}
