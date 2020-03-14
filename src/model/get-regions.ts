const Graph = require('node-dijkstra')

export type Region = string[]

export const getRegions = (nodes: {
  name: string
  connectedTo: string[]
}[]): Region[] => {
  return nodes.map(node => {
    return node.connectedTo.map(neighbour => {
      const graph = new Graph(
        nodes
          .map(node$ => node$.name === node.name 
            ? {...node$, connectedTo: node$.connectedTo.filter(c => c !== neighbour)}
            : node$)
          .map(node$ => node$.name === neighbour
            ? {...node$, connectedTo: node$.connectedTo.filter(c => c !== node.name)}
            : node$)
          .reduce((vertices, node) => {
            return {
              ...vertices,
              [node.name]: node.connectedTo.reduce((result, name) => ({
                ...result,
                [name]: 1
              }), {})
            }
          }, {})
      )
      return graph.path(node.name, neighbour)
    })
  })
  .reduce((a, b) => a.concat(b), [])
  .filter(Boolean)
  .filter(nodes => nodes.length > 2)
  .map<Region>(region => region.slice().sort())

  // Remove identical region
  .filter((region, index, regions) => index === regions
    .findIndex(region$ => region.join('-') === region$.join('-')))

  // Remove non-smallest set region
  // For example, if ['a', 'b', 'c'] and ['a', 'b', 'c', 'd'] exists, will we remove ['a', 'b', 'c', 'd']
  .map(region => region.join('_'))
  .filter((region, index, regions) => !regions.some(region$ => region$.length !== region.length && region.includes(region$)))
  .map(region => region.split('_'))
}
