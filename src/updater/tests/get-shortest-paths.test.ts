import { cities } from './../../model/cities';
import { getShortestPaths } from './../get-shortest-paths';
describe('get shortest path', () => {
  test('case 1 ', () => {
    const result = getShortestPaths({
      cities,
      from: 'Ciudad Real',
      to: 'Albacete'
    })

    expect(result).toEqual([
      ['Ciudad Real', 'Albacete']
    ])
  })

  test('case 2 ', () => {
    const result = getShortestPaths({
      cities,
      from: 'Lisboa',
      to: 'Huelva'
    })
    expect(result).toEqual([
      ['Lisboa', 'Evora', 'Huelva'], 
      ['Lisboa', 'Albufeira', 'Huelva']
    ])
  })

  test('case 3 ', () => {
    const result = getShortestPaths({
      cities,
      from: 'Madrid',
      to: 'Burgos'
    })
    expect(result).toEqual([
      ['Madrid', 'Valladolid', 'Burgos']
    ])
  })
})