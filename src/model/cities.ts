export type City = {
  color: 'red' | 'blue' | 'yellow' | 'black'
  name: CityName
  connectedTo: {
    name: CityName
    cannotBuildRailRoad?: boolean
  }[]
  position: {
    /**
     * Zero-based.
     */
    column: number

    /**
     * One-based.
     */
    row: number
  }
  isPort?: boolean
}
export type CityName
  = 'A Coruna'
  | 'Santiago De Compostela'
  | 'Vigo'
  | 'Ourense'
  | 'Braga'
  | 'Porto'
  | 'Salamanca'
  | 'Coimbra'
  | 'Lisboa'
  | 'Evora'
  | 'Albufeira'
  | 'Toledo'
  | 'Caceres'
  | 'Badajoz'
  | 'Ciudad Real'
  | 'Jaen'
  | 'Cordoba'
  | 'Huelva'
  | 'Sevilla'
  | 'Granada'
  | 'Malaga'
  | 'Almeria'
  | 'Cadiz'
  | 'Gibraltar'
  | 'Gijon'
  | 'Leon'
  | 'Santander'
  | 'Bilbao-bilbo'
  | 'Pamplona'
  | 'Burgos'
  | 'Vitoria-Gasteiz'
  | 'Soria'
  | 'Madrid'
  | 'Valladolid'
  | 'Albacete'
  | 'Cuenca'
  | 'Teruel'
  | 'Zaragoza'
  | 'Valencia'
  | 'Taragona'
  | 'Andorra La Vella'
  | 'Girona'
  | 'Barcelona'
  | 'Huesca'
  | 'Palma De Mallorca'
  | 'Cartagena'


export const cities: City[] = [{
  color: 'blue',
  name: 'A Coruna',
  connectedTo: [{ name: 'Santiago De Compostela' }, { name: 'Gijon' }],
  isPort: true,
  position: { column: 2, row: 1 }
}, {
  color: 'blue',
  name: 'Santiago De Compostela',
  connectedTo: [{ name: 'A Coruna' }, { name: 'Vigo' }, { name: 'Ourense' }],
  position: { column: 2, row: 2 }
}, {
  color: 'blue',
  name: 'Vigo',
  connectedTo: [{ name: 'Santiago De Compostela' }, { name: 'Porto' }, { name: 'Ourense' }, { name: 'Braga' }],
  isPort: true,
  position: { column: 1, row: 4 }
}, {
  color: 'blue',
  name: 'Ourense',
  connectedTo: [{ name: 'Santiago De Compostela' }, { name: 'Vigo' }, { name: 'Leon' }],
  position: { column: 5, row: 4 }
}, {
  color: 'blue',
  name: 'Braga',
  connectedTo: [{ name: 'Vigo' }, { name: 'Porto' }, { name: 'Salamanca' }],
  position: { column: 4, row: 6 }
}, {
  color: 'blue',
  name: 'Porto',
  isPort: true,
  connectedTo: [{ name: 'Braga' }, { name: 'Vigo' }, { name: 'Coimbra' }, { name: 'Lisboa' }],
  position: { column: 1, row: 7 }
}, {
  color: 'blue',
  name: 'Salamanca',
  connectedTo: [{ name: 'Leon' }, { name: 'Valladolid' }, { name: 'Madrid' }, { name: 'Caceres' }, { name: 'Braga' }],
  position: { column: 7, row: 7 }
}, {
  color: 'blue',
  name: 'Coimbra',
  connectedTo: [{ name: 'Caceres' }, { name: 'Lisboa' }, { name: 'Porto' }],
  position: { column: 3, row: 9 }
}, {
  color: 'blue',
  name: 'Caceres',
  connectedTo: [{ name: 'Salamanca' }, { name: 'Toledo' }, { name: 'Badajoz' }, { name: 'Coimbra' }],
  position: { column: 6, row: 11 }
}, {
  color: 'blue',
  name: 'Lisboa',
  isPort: true,
  connectedTo: [{ name: 'Porto' }, { name: 'Coimbra' }, { name: 'Evora' }, { name: 'Albufeira' }],
  position: { column: 0, row: 13 }
}, {
  color: 'blue',
  name: 'Evora',
  connectedTo: [{ name: 'Badajoz' }, { name: 'Huelva' }, { name: 'Lisboa' }],
  position: { column: 3, row: 14 }
}, {
  color: 'blue',
  name: 'Albufeira',
  isPort: true,
  connectedTo: [{ name: 'Huelva' }, { name: 'Lisboa' }],
  position: { column: 2, row: 17 }
}, {
  color: 'black',
  name: 'Toledo',
  connectedTo: [{ name: 'Madrid' }, { name: 'Ciudad Real' }, { name: 'Caceres' }],
  position: { column: 9, row: 10 }
}, {
  color: 'black',
  name: 'Badajoz',
  connectedTo: [{ name: 'Caceres' }, { name: 'Ciudad Real' }, { name: 'Cordoba' }, { name: 'Evora' }],
  position: { column: 5, row: 13 }
}, {
  color: 'black',
  name: 'Ciudad Real',
  connectedTo: [{ name: 'Madrid' }, { name: 'Albacete' }, { name: 'Cordoba' }, { name: 'Badajoz' }, { name: 'Toledo' }],
  position: { column: 11, row: 12 },
}, {
  color: 'black',
  name: 'Cordoba',
  connectedTo: [{ name: 'Ciudad Real' }, { name: 'Jaen' }, { name: 'Malaga' }, { name: 'Sevilla' }, { name: 'Badajoz' }],
  position: { column: 9, row: 15 }
}, {
  color: 'black',
  name: 'Jaen',
  connectedTo: [{ name: 'Albacete' }, { name: 'Granada' }, { name: 'Cordoba' }],
  position: { column: 11, row: 15 }
}, {
  color: 'black',
  name: 'Huelva',
  isPort: true,
  connectedTo: [{ name: 'Sevilla' }, { name: 'Cadiz', cannotBuildRailRoad: true }, { name: 'Albufeira' }, { name: 'Evora' }],
  position: { column: 5, row: 17 }
}, {
  color: 'black',
  name: 'Sevilla',
  connectedTo: [{ name: 'Cordoba' }, { name: 'Malaga' }, { name: 'Cadiz' }, { name: 'Huelva' }],
  position: { column: 7, row: 17 }
}, {
  color: 'black',
  name: 'Granada',
  connectedTo: [{ name: 'Jaen' }, { name: 'Almeria' }, { name: 'Malaga' }],
  position: { column: 12, row: 16 }
}, {
  color: 'black',
  name: 'Cadiz',
  isPort: true,
  connectedTo: [{ name: 'Sevilla' }, { name: 'Gibraltar', cannotBuildRailRoad: true }, { name: 'Huelva', cannotBuildRailRoad: true }],
  position: {column: 6, row: 19}
}, {
  color: 'black',
  name: 'Malaga',
  isPort: true,
  connectedTo: [{name: 'Granada' }, {name: 'Almeria'}, {name: 'Gibraltar', cannotBuildRailRoad: true}, {name: 'Sevilla'}, {name: 'Cordoba'}],
  position: {column: 10, row: 18}
}, {
  color: 'black',
  name: 'Almeria',
  isPort: true,
  connectedTo: [{name: 'Cartagena'}, {name: 'Malaga'}, {name: 'Granada'}],
  position: {column: 14, row: 18}
}, {
  color: 'black',
  name: 'Gibraltar',
  isPort: true,
  connectedTo: [{name: 'Malaga', cannotBuildRailRoad: true}, {name: 'Cadiz', cannotBuildRailRoad: true},],
  position: {column: 8, row: 19}
}]