import { getRegions } from '../get-regions';
describe('get-regions', () => {
  test('case 1', () => {
    expect(getRegions([
      { name: 'a', connectedTo: ['b', 'c'] },
      { name: 'b', connectedTo: ['c', 'a'] },
      { name: 'c', connectedTo: ['c', 'a'] }
    ]))
      .toEqual([
        ['a', 'b', 'c']
      ])
  })

  test('case 2', () => {
    expect(getRegions([
      { name: 'a', connectedTo: ['b', 'c'] },
      { name: 'b', connectedTo: ['c', 'a', 'd'] },
      { name: 'c', connectedTo: ['c', 'a', 'd'] },
      { name: 'd', connectedTo: ['b', 'c'] }
    ]))
      .toEqual([
        ['a', 'b', 'c'],
        ['b', 'c', 'd']
      ])
  })
})