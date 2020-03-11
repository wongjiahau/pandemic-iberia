import React from 'react';
import 'react-tippy/dist/tippy.css';
import { infectionCountMarkers } from '../model/game';
import { getAdjacentRegions } from '../model/get-adjacent-regions';
import { setupGame } from '../model/setup-game';
import { executeAction } from '../updater/execute-action';
import { getPossibleActions } from '../updater/get-possible-actions';
import { notUndefined } from '../util/not-undefined';
import './App.css';
import { Deck } from './deck';
import { Map } from './map';
import { PlayerCardsInfo } from './player-cards-info';
import { Tracker } from './tracker';
import { CityCard } from './city-card';
import * as shuffle from 'shuffle-array';
import { PlayerAction } from '../model/player-action';
import { Tooltip } from 'react-tippy';


function App() {
  const [game, updateGame] = React.useState(setupGame())
  const adjecentRegions = [
    ...getAdjacentRegions(game.cities.map(city => ({
      name: city.name,
      connectedTo: city.connectedTo.map(neighbour => neighbour.name)
    })))
    .map(region => region.map(name => game.cities.find(city => city.name === name)).filter(notUndefined))
    .map(region => {
      const rationalAverage = (xs: number[]) => {
        const average = Math.round(xs.reduce((sum, x) => x + sum, 0) / xs.length)
        const min = xs.reduce((min, x) => x < min ? x : min, Number.MAX_SAFE_INTEGER)
        const max = xs.reduce((max, x) => x > max ? x : max, Number.MIN_SAFE_INTEGER)
        return average <= min 
          ? average + 1
          : (average >= max ? average - 1 : average)
      }
      return {
        cities: region,
        position: {
          column: rationalAverage(region.map(({position: {column}}) => column)),
          row: rationalAverage(region.map(({position: {row}}) => row)),
        }
      }
    }),

    // Missing region that cannot be computed
    {
      cities: ['Burgos', 'Soria', 'Zaragoza', 'Madrid', 'Valladolid']
        .map(cityName => game.cities.find(city => city.name === cityName))
        .filter(notUndefined)
        ,
      position: {column: 12, row: 6}
    }
  ]

  const possibleActions = getPossibleActions({game})
  console.log(possibleActions)

  React.useEffect(() => {

    const chosenAction = shuffle.pick(possibleActions, { picks: 1 }) as unknown as PlayerAction
    // if(chosenAction) {
    //   setTimeout(() => {
    //     console.log(chosenAction)
    //     updateGame(executeAction(chosenAction))
    //   }, 500)
    // }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(possibleActions)])

  const allColors = game.cities
    .map(city => city.color)
    .filter((x, i, xs) => i === xs.indexOf(x))

  return (
    <div style={{display: 'grid', height: '100vh', width: '100vw', gridTemplateColumns: '1fr auto'}}>
      <Map 
        cities={game.cities} 
        hospitals={game.hospitals}
        infectedCities={game.infectedCities} 
        playerPositions={game.playerPositions}
        adjacentRegions={adjecentRegions}
        railRoads={game.railRoads}
        highlightedRoads={possibleActions.flatMap(action => {
          const onClick = () => updateGame(executeAction(action))
          switch(action.type) {
            case 'build railroads':
              return [{
                onClick,
                between: action.between,
                tooltip: `Build railroad between ${action.between[0]} and ${action.between[1]}`
              }]

            case 'move patient towards hospital':
              return [{
                onClick,
                between: [action.from, action.to],
                tooltip: `Move ${action.patientColor} patient from ${action.from} to ${action.to}`
              }]
            default:
              return []
          }
        })}
        highlightedCities={possibleActions.flatMap(action => {
          const onClick = () => updateGame(executeAction(action))
          switch(action.type) {
            case 'set starting position':
              return [{
                cityName: action.cityName,
                onClick, 
                tooltip: `Set ${action.cityName} as starting position.`
              }]

            case 'move':
              return [{
                cityName: action.to,
                onClick,
                tooltip: `Move to ${action.to} by ${action.by}`
              }]

            case 'treat disease':
              return [{
                cityName: action.on,
                onClick,
                tooltip: `Treat disease on ${action.on}`
              }]

            case 'outbreak':
              return [{
                cityName: action.cityName,
                onClick,
                tooltip: `Outbreak`
              }]
            
            default:
              return []
          }
        })}
        />
      <div style={{display: 'grid', padding: '12px', gridGap: '12px', alignContent: 'start'}}>
        <div style={{display: 'grid', gridGap: '12px'}}>
          <Tracker label={'Infection Rate'} levels={infectionCountMarkers.map(x => x.toString())} 
            focusedIndex={game.infectionRateIndex}/>
          <Tracker label={'Outbreaks'} levels={[0,1,2,3,4,5,6,7].map(x => x.toString())} 
            focusedIndex={game.outbreakLevel}/>
          <Deck label='Player Deck' cards={game.playerDeck} cardColor='green'
            highlight={possibleActions.some(action => action.type === 'draw 2 player cards') 
              ? {
                tooltip: 'Draw 2 player cards',
                onClick: () => updateGame(executeAction({
                  type: 'draw 2 player cards', 
                  playerName: game.currentPlayer.name
                }))
              }
              : undefined
            }/>
          <Deck label='Discarded Player Cards' cards={game.playerDiscardPile} cardColor='green'/>
          <Deck label='Infection Deck' cards={game.infectionDeck} cardColor='pink'
            highlight={possibleActions.some(action => action.type === 'draw infection cards')
              ? {
                tooltip: 'Draw infection cards',
                onClick: () => updateGame(executeAction({
                  type: 'draw infection cards',
                  playerName: game.currentPlayer.name
                }))
              }
              : undefined
            }/>
          <Deck label='Discarded Infection Cards' cards={game.infectionDiscardPile} cardColor='pink'/>
        </div>
        <div>
          <div style={{fontWeight: 'bold'}}>Researched Diseases</div>
          {allColors.map((color, index) => { 
            const canResearch = possibleActions.some(action => 
              action.type === 'research disease' && action.color === color)

            return (
              <Tooltip key={index}
                title={`Research ${color} disease`}
                open={canResearch ? undefined : false}>
                <div className={canResearch ? 'shockwave' : undefined} 
                  style={{display: 'grid', gridAutoFlow: 'column', 
                    justifyContent: 'start', alignItems: 'center', gridGap: '4px'}}>
                  <div style={{height: '8px', width: '8px', backgroundColor: color}}/>
                  {color}
                  {game.researchedDisease.includes(color) && 
                    <div className='debut'>
                      🔬
                    </div>}
                </div>
              </Tooltip>
            )
  })}
        </div>
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gridGap: '12px'}}>
          <div style={{fontWeight: 'bold', gridColumn: '1 / span 2'}}>Players</div>
          {game.playerCards.map((playerCards, index) => (
            <PlayerCardsInfo 
              key={index} 
              playerCards={playerCards}
              highlightCard={(card, cardIndex) => {
                const discardCardAction = possibleActions.find(
                  action => action.type === 'discard a card'
                  &&
                  action.playerName === playerCards.playerName
                )
                const epidemicAction = possibleActions
                  .find(action => action.type === 'epidemic')

                const buildHospitalAction = possibleActions
                  .find(action => action.type === 'build hospital') 

                if(discardCardAction) {
                  return {
                    needHighlight: true,
                    onClick: () => updateGame(executeAction(discardCardAction)),
                    tooltip: `Discard ${card.type === 'city' ? card.cityName : ''}`
                  }
                }
                else if(epidemicAction) {
                  return {
                    needHighlight: card.type === 'epidemic',
                    onClick: () => updateGame(executeAction(epidemicAction)),
                    tooltip: 'Launch epidemic!'
                  }
                }
                else if(buildHospitalAction && buildHospitalAction.type === 'build hospital') {
                  return {
                    needHighlight: card.type === 'city' 
                      && card.cityName === buildHospitalAction.city.cityName,
                    onClick: () => updateGame(executeAction(buildHospitalAction)),
                    tooltip: `Build hospital on ${buildHospitalAction.city.cityName}`
                  }
                }
                else {
                  return {
                    needHighlight: false,
                    onClick: () => {},
                    tooltip: ''
                  }
                }
              }}
              />
          ))}
        </div>
        <div style={{color: 'green'}}>
          {game.currentPlayer.name}'s turn to perform action #{game.currentPlayer.numberOfPerformedActions + 1}.
        </div>
        <div>
          {game.drawnInfectionCards.length > 0 &&
            <div className='shockwave'
              onClick={() => 
              updateGame(executeAction({
                type: 'use drawn infection cards', 
                playerName: game.currentPlayer.name
              }))}>
              Use drawn infection cards
            </div>}
          {game.drawnInfectionCards.map((infectionCard, index) => (
            <div key={index}>
              <CityCard
                cityColor={infectionCard.cityColor}
                cityName={infectionCard.cityName}
                />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
