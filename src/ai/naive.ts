import { executeAction } from './../updater/execute-action';
import { getPossibleActions } from './../updater/get-possible-actions';
import { setupGame } from './../model/setup-game';
import * as shuffle from 'shuffle-array';
import { PlayerAction } from '../model/player-action';
const { Population } = require('neuroevolution')

const populationSize = 100
const numberOfInputs = 2
const numberOfOutputs = 4
const population = new Population(populationSize, numberOfInputs, numberOfOutputs, false)

const xor: [[number, number], number][] = [
  [[0, 0], 0],
  [[0, 1], 1],
  [[1, 0], 1],
  [[1, 1], 0],
]

const numberOfIterations = 1000
population.evolve(numberOfIterations, (genome: any) => {
  // console.log(genome)
  // const network = genome.generateNetwork()
  // let error = 0;
  // for (const [input, output] of xor) {
  //   const [prediction] = network.predict(input)
  //   error += Math.abs(prediction - output)
  // }
  // const fitnessScore = 1 - (error / xor.length)
  // console.log(fitnessScore)
  // return fitnessScore
})

export const naivePlayer = () => {
  for (let index = 0; index < 1; index++) {
    try {
      let game = setupGame()
      while(true) {
        const possibleActions = getPossibleActions({game})
        if(possibleActions.some(action => action.type === 'game ended' && action.reason.type === 'four diseases cured')) {
          alert(`Won game #${index}`)
          break
        }
        if(possibleActions.some(action => action.type === 'game ended')) {
          console.log(`Lost game #${index}`)
          break
        }
        const chosenAction = shuffle.pick(possibleActions, { picks: 1 }) as unknown as PlayerAction
        game = executeAction(chosenAction)(game)
      }
    }
    catch(error) {
      console.error(`Error at game #${index}`, error)
    }
  }
}