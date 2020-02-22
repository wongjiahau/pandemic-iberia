import React from 'react';
import logo from './logo.svg';
import './App.css';
import { setupGame } from '../model/setup-game';
import { ArcherContainer, ArcherElement } from 'react-archer';
import { CityName } from '../model/cities';


function App() {
  const [state, setState] = React.useState(setupGame())
  const getCityId = (cityName: CityName) => cityName.replace(/\s/gi, '')
  
  return (
    <ArcherContainer strokeColor='grey'>
      <div style={{
        display: 'grid', 
        height: '100vh', 
        width: '100vw',
        gridTemplateColumns: 'repeat(24, 1fr)',
        gridTemplateRows: 'repeat(19, 1fr)',
        gridGap: '18px'
      }}>
        {state.cities.map((city, index) => (
          <ArcherElement
            key={index}
            id={getCityId(city.name)}
            style={{
              gridColumn: city.position.column + 1, 
              gridRow: city.position.row,
            }}
            relations={city.connectedTo.map(city => ({
              targetId: getCityId(city.name),
              targetAnchor: 'middle',
              sourceAnchor: 'middle',
              ...(city.cannotBuildRailRoad ? {style: {strokeDasharray: '8'}} : {})
            }))}
          >
            <div key={index} style={{
              backgroundColor: city.color,
              borderRadius: '24px',
              width: '24px',
              height: '24px',
              fontSize: '8px',
              color: 'white'
            }}>
              {city.name}
            </div>
          </ArcherElement>
        ))}
      </div>
    </ArcherContainer>
  );
}

export default App;
