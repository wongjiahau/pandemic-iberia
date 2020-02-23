import React from 'react';
import './App.css';
import 'react-tippy/dist/tippy.css'
import { setupGame } from '../model/setup-game';
import { getAdjacentRegions } from '../model/get-adjacent-regions';
import { notUndefined } from '../util/not-undefined';
import {Map} from './map'
import { Tracker } from './tracker';
import { Deck } from './deck';
import { PlayerCardsInfo } from './player-cards-info';
import { executeAction } from '../updater/execute-action';
import { getPossibleActions } from '../updater/get-possible-actions';


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

  return (
    <div style={{display: 'grid', height: '100vh', width: '100vw', gridTemplateColumns: '1fr auto'}}>
      <Map 
        cities={game.cities} 
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
                tooltip: `Move to ${action.to}`
              }]

            case 'treat disease':
              return [{
                cityName: action.on,
                onClick: () => updateGame(executeAction(action)),
                tooltip: `Treat disease on ${action.on}`
              }]
            
            default:
              return []
          }
        })}
        />
      <div style={{display: 'grid', padding: '12px', gridGap: '12px', alignContent: 'start'}}>
        <div style={{display: 'grid', gridGap: '12px'}}>
          <Tracker label={'Infection Rate'} levels={[2,2,2,3,3,4,4].map(x => x.toString())} 
            focusedIndex={game.infectionRateIndex}/>
          <Tracker label={'Outbreaks'} levels={[0,1,2,3,4,5,6,7].map(x => x.toString())} 
            focusedIndex={game.outbreakLevel}/>
          <Deck label='Player Deck' cards={game.playerDeck} cardColor='green'/>
          <Deck label='Discarded Player Cards' cards={game.playerDiscardPile} cardColor='green'/>
          <Deck label='Infection Deck' cards={game.infectionDeck} cardColor='pink'/>
          <Deck label='Discarded Infection Cards' cards={game.infectionDiscardPile} cardColor='pink'/>
        </div>
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gridGap: '12px'}}>
          {game.playerCards.map((playerCards, index) => (
            <PlayerCardsInfo key={index} playerCards={playerCards}/>
          ))}
        </div>
        <div style={{color: 'green'}}>
          {game.currentPlayer.name}'s turn to perform action #{game.currentPlayer.turn + 1}.
        </div>
      </div>
    </div>
  );
}

export default App;
