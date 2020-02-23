import { getAdjacentRegions } from './../get-adjacent-regions';
describe('get-adjacent-region', () => {
  test('case 1', () => {
    expect(getAdjacentRegions([
      {name: 'a', connectedTo: ['b', 'c']},
      {name: 'b', connectedTo: ['c', 'a']},
      {name: 'c', connectedTo: ['c', 'a']}
    ]))
    .toEqual([
      ['a', 'b', 'c']
    ])
  })
  test('case 2', () => {
    expect(getAdjacentRegions([
      {name: 'a', connectedTo: ['b', 'c']},
      {name: 'b', connectedTo: ['c', 'a', 'd']},
      {name: 'c', connectedTo: ['c', 'a', 'd']},
      {name: 'd', connectedTo: ['b', 'c']}
    ]))
  .toEqual([
    ['a', 'b', 'c'],
    ['b', 'c', 'd']
  ])
  })
})