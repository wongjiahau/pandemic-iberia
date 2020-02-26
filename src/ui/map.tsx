import React from 'react';
import { ArcherContainer, ArcherElement } from 'react-archer';
import { City, CityName } from '../model/cities';
import { Game } from '../model/game';
import {Tooltip} from 'react-tippy'

export const Map: React.FC<{
  cities: City[],
  adjacentRegions: {
    cities: City[];
    position: {
        column: number;
        row: number;
    };
  }[],
  railRoads: Game['railRoads']
  infectedCities: Game['infectedCities']
  playerPositions: Game['playerPositions']
  highlightedCities: {
    cityName: CityName
    onClick: () => void
    tooltip: string
  }[]
  highlightedRoads: {
    between: [CityName, CityName]
    onClick: () => void
    tooltip: string
  }[]
}> = props => {
  const size = '2.4vmin'
  const getCityId = (cityName: CityName) => cityName.replace(/\s/gi, '')

  return (
    <ArcherContainer arrowThickness={0} strokeColor='grey' style={{ display: 'grid' }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(25, ${size})`,
        gridTemplateRows: `repeat(19, ${size})`,
        gridGap: size,
        width: '100%',
        height: '100%',
        overflow: 'auto',
        justifyItems: 'center',
        alignItems: 'center',
        padding: '28px'
      }}>
        {/* Render cities */}
        {props.cities.map((city, index) => {
          const cityHighlighted = props.highlightedCities.find(({cityName}) => city.name === cityName)
          const highlightCity = cityHighlighted 
            ? (node: React.ReactNode) => <Tooltip arrow title={cityHighlighted.tooltip}>{node}</Tooltip>
            : (node: React.ReactNode) => node

          const findHighlightedRoad = (neighbour: CityName) =>
            props.highlightedRoads.find(({between: [a, b]}) => 
              (a === city.name && b === neighbour)
                || 
              (b === city.name && a === neighbour)
            )

          const roadLabel = (neighbour: CityName) => {
            const highlightedRoad = findHighlightedRoad(neighbour)
            return highlightedRoad
              ? <Tooltip arrow title={highlightedRoad.tooltip} >
                  <div className='wiggle' style={{height: '24px', width: '24px', zIndex: 100}} 
                    onClick={highlightedRoad.onClick}> 
                    🛠 
                  </div>
                </Tooltip>
              : <div/>
          }

          return (
            <ArcherElement
              key={index}
              id={getCityId(city.name)}
              style={{ 
                gridColumn: city.position.column + 1, 
                gridRow: city.position.row, 
                display: 'grid', 
                pointerEvents: 'none'
              }}
              relations={city.connectedTo.map(neighbour => ({
                targetId: getCityId(neighbour.name),
                targetAnchor: 'middle',
                sourceAnchor: 'middle',
                ...(neighbour.cannotBuildRailRoad 
                  ? { style: { strokeDasharray: '12' } } 
                  : props.railRoads.some(({between: [a, b]}) => 
                      (a === city.name && b === neighbour.name)
                        ||
                      (b === city.name && a === neighbour.name)
                    )
                    ? {style: {strokeWidth: 16}}
                    : {style: {strokeWidth: 2}}),
                label: roadLabel(neighbour.name)
              }))}
            >
              <div style={{
                display: 'grid', justifyItems: 'center', alignItems: 'center',
                whiteSpace: 'nowrap', gridGap: '2px', gridTemplateRows: '1fr 1fr 1fr',
                pointerEvents: 'none'
              }}>
                <div style={{ display: 'block', fontSize: '12px', pointerEvents: 'none' }}>
                  <a href='_' style={{display: 'block', pointerEvents: 'none', textAlign: 'center'}}> 
                    {city.name + (city.isPort ? '⚓' : '')} 
                  </a>
                  <div style={{fontWeight: 'bold', pointerEvents: 'none', fontSize: '12px'}}>
                    {props.playerPositions
                      .filter(position => position.cityName === city.name)
                      ?.map(position => position.playerName)
                      .join(', ')} 
                  </div>
                </div>
                {highlightCity(
                  <div key={index} 
                    className={cityHighlighted ? 'shockwave' : undefined}
                    onClick={cityHighlighted?.onClick}
                    style={{
                      backgroundColor: city.color,
                      borderRadius: size,
                      width: size,
                      height: size,
                      pointerEvents: 'auto'
                    }} />
                )}
                <div style={{ display: 'grid', gridAutoFlow: 'column', gridGap: '4px', pointerEvents: 'none', 
                  alignSelf: 'start' }}>
                  {props.infectedCities.find(infectedCity => infectedCity.cityName === city.name)?.patients
                    .map((color, index) => (
                      <div key={index} style={{ backgroundColor: color, height: '6px', width: '6px' }} />
                    ))}
                </div>
              </div>
            </ArcherElement>
          )
        })}
        {/* Render adjacent regions */}
        {props.adjacentRegions.map((adjacentRegion, index) => (
          <ArcherElement id={'adjacent-region-' + index} key={index}
            style={{ gridColumn: adjacentRegion.position.column + 1, gridRow: adjacentRegion.position.row }}
          >
            <div
              onClick={() => {
                alert(adjacentRegion.cities.map(city => city.name).join(','))
              }}
            >
              <span aria-label='water' role='img'> 🚰 </span>
              </div>
          </ArcherElement>
        ))}
      </div>
    </ArcherContainer>
  )
}