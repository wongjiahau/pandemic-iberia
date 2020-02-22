export type Player = {
  color: 'green'
  name: 'Argonomist'
} | {
  color: 'black'
  name: 'Railwayman'
} | {
  color: 'yellow'
  name: 'Politician'
} | {
  color: 'white'
  name: 'Royal Academy Scientist'
} | {
  color: 'red'
  name: 'Nurse'
} | {
  color: 'purple'
  name: 'Rural Doctor'
} | {
  color: 'blue'
  name: 'Sailor'
}

export const allPlayers: Player[] = [
  {color: 'green', name: 'Argonomist'},
  {color: 'black', name: 'Railwayman'},
  {color: 'yellow', name: 'Politician'},
  {color: 'white', name: 'Royal Academy Scientist'},
  {color: 'red', name: 'Nurse'},
  {color: 'purple', name: 'Rural Doctor'},
  {color: 'blue', name: 'Sailor'}
]

export type PlayerColor = Player['color']