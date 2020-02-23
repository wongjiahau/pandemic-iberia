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
  infectedCities: Game['infectedCities']
  playerPositions: Game['playerPositions']
  highlightedCities: {
    cityName: CityName
    onClick: () => void
    tooltip: string
  }[]
}> = props => {
  const size = '2.4vmin'
  const getCityId = (cityName: CityName) => cityName.replace(/\s/gi, '')
  return (
    <ArcherContainer arrowThickness={0} strokeWidth={2} strokeColor='grey' style={{ display: 'grid' }}>
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
          const highlighted = props.highlightedCities.find(({cityName}) => city.name === cityName)
          const highlight = highlighted 
            ? (node: React.ReactNode) => <Tooltip arrow title={highlighted.tooltip}>{node}</Tooltip>
            : (node: React.ReactNode) => node

          return (
            <ArcherElement
              key={index}
              id={getCityId(city.name)}
              style={{ gridColumn: city.position.column + 1, gridRow: city.position.row, display: 'grid' }}
              relations={city.connectedTo.map(city => ({
                targetId: getCityId(city.name),
                targetAnchor: 'middle',
                sourceAnchor: 'middle',
                ...(city.cannotBuildRailRoad ? { style: { strokeDasharray: '12' } } : {})
              }))}
            >
              <div style={{
                display: 'grid', justifyItems: 'center', alignItems: 'center',
                whiteSpace: 'nowrap', gridGap: '4px', gridTemplateRows: '1fr 1fr 1fr'
              }}>
                <div style={{ fontSize: '12px' }}>
                  {city.name}
                  {city.isPort && '⚓'}
                  <div style={{fontWeight: 'bold'}}>
                    {props.playerPositions.find(position => position.cityName === city.name)?.playerName}
                  </div>
                </div>
                {highlight(
                  <div key={index} 
                    className={highlighted ? 'shockwave' : undefined}
                    onClick={highlighted?.onClick}
                    style={{
                      backgroundColor: city.color,
                      borderRadius: size,
                      width: size,
                      height: size,
                      fontSize: '18px',
                    }} />
                )}
                <div style={{ display: 'grid', gridAutoFlow: 'column', gridGap: '4px' }}>
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
              🚰
              </div>
          </ArcherElement>
        ))}
      </div>
    </ArcherContainer>
  )
}