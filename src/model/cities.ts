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
  | 'Cartagena'
  | 'San Sebastian-Donostia'
  | 'Palma de Mallorca'
  | 'Alicante'

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
  position: { column: 6, row: 19 }
}, {
  color: 'black',
  name: 'Malaga',
  isPort: true,
  connectedTo: [{ name: 'Granada' }, { name: 'Almeria' }, { name: 'Gibraltar', cannotBuildRailRoad: true }, { name: 'Sevilla' }, { name: 'Cordoba' }],
  position: { column: 10, row: 18 }
}, {
  color: 'black',
  name: 'Almeria',
  isPort: true,
  connectedTo: [{ name: 'Cartagena' }, { name: 'Malaga' }, { name: 'Granada' }],
  position: { column: 14, row: 18 }
}, {
  color: 'black',
  name: 'Gibraltar',
  isPort: true,
  connectedTo: [{ name: 'Malaga', cannotBuildRailRoad: true }, { name: 'Cadiz', cannotBuildRailRoad: true },],
  position: { column: 8, row: 19 }
}, {
  color: 'red',
  name: 'Gijon',
  isPort: true,
  connectedTo: [{ name: 'Santander' }, { name: 'Leon' }, { name: 'A Coruna' }],
  position: { column: 7, row: 1 }
}, {
  color: 'red',
  name: 'Santander',
  isPort: true,
  connectedTo: [{ name: 'Bilbao-bilbo' }, { name: 'Valladolid' }, { name: 'Gijon' }],
  position: { column: 11, row: 1 }
}, {
  color: 'red',
  name: 'San Sebastian-Donostia',
  isPort: true,
  connectedTo: [{ name: 'Pamplona' }, { name: 'Bilbao-bilbo' }],
  position: { column: 15, row: 1 },
}, {
  color: 'red',
  name: 'Bilbao-bilbo',
  connectedTo: [{ name: 'San Sebastian-Donostia' }, { name: 'Vitoria-Gasteiz' }, { name: 'Santander' }],
  position: { column: 13, row: 2 }
}, {
  color: 'red',
  name: 'Leon',
  connectedTo: [{ name: 'Gijon' }, { name: 'Salamanca' }, { name: 'Ourense' }],
  position: { column: 7, row: 3 }
}, {
  color: 'red',
  name: 'Burgos',
  connectedTo: [{ name: 'Vitoria-Gasteiz' }, { name: 'Soria' }, { name: 'Valladolid' }],
  position: { column: 11, row: 4 }
}, {
  color: 'red',
  name: 'Vitoria-Gasteiz',
  connectedTo: [{ name: 'Bilbao-bilbo' }, { name: 'Pamplona' }, { name: 'Zaragoza' }, { name: 'Burgos' }],
  position: { column: 13, row: 4 }
}, {
  color: 'red',
  name: 'Pamplona',
  connectedTo: [{ name: 'San Sebastian-Donostia' }, { name: 'Huesca' }, { name: 'Vitoria-Gasteiz' }],
  position: { column: 15, row: 3 }
}, {
  color: 'red',
  name: 'Huesca',
  connectedTo: [{ name: 'Andorra La Vella', cannotBuildRailRoad: true }, { name: 'Zaragoza' }, { name: 'Pamplona' }],
  position: { column: 17, row: 4 }
}, {
  color: 'red',
  name: 'Valladolid',
  connectedTo: [{ name: 'Santander' }, { name: 'Burgos' }, { name: 'Madrid' }, { name: 'Salamanca' }],
  position: { column: 9, row: 6 },
}, {
  color: 'red',
  name: 'Soria',
  connectedTo: [{ name: 'Zaragoza' }, { name: 'Burgos' }],
  position: { column: 13, row: 6 }
}, {
  color: 'red',
  name: 'Madrid',
  connectedTo: [{ name: 'Zaragoza' }, { name: 'Cuenca' }, { name: 'Ciudad Real' }, { name: 'Toledo' }, { name: 'Salamanca' }, { name: 'Valladolid' }],
  position: { column: 11, row: 9 }
}, {
  color: 'yellow',
  name: 'Andorra La Vella',
  connectedTo: [{ name: 'Girona', cannotBuildRailRoad: true }, { name: 'Huesca', cannotBuildRailRoad: true }],
  position: { column: 21, row: 3 }
}, {
  color: 'yellow',
  name: 'Girona',
  connectedTo: [{ name: 'Andorra La Vella', cannotBuildRailRoad: true }, { name: 'Barcelona' }],
  position: { column: 24, row: 5 }
}, {
  color: 'yellow',
  name: 'Zaragoza',
  connectedTo: [{ name: 'Huesca' }, { name: 'Barcelona' }, { name: 'Teruel' }, { name: 'Madrid' }, { name: 'Soria' }, { name: 'Vitoria-Gasteiz' }],
  position: { column: 17, row: 6 }
}, {
  color: 'yellow',
  name: 'Barcelona',
  connectedTo: [{ name: 'Girona' }, { name: 'Palma de Mallorca', cannotBuildRailRoad: true }, { name: 'Taragona' }, { name: 'Zaragoza' }],
  position: { column: 22, row: 6 }
}, {
  color: 'yellow',
  name: 'Teruel',
  connectedTo: [{ name: 'Zaragoza' }, { name: 'Taragona' }, { name: 'Cuenca' }],
  position: { column: 16, row: 9 }
}, {
  color: 'yellow',
  name: 'Taragona',
  isPort: true,
  connectedTo: [{ name: 'Barcelona' }, { name: 'Valencia' }, { name: 'Teruel' }],
  position: { column: 20, row: 7 }
}, {
  color: 'yellow',
  name: 'Cuenca',
  connectedTo: [{ name: 'Teruel' }, { name: 'Valencia' }, { name: 'Albacete' }, { name: 'Madrid' }],
  position: { column: 14, row: 10 }
}, {
  color: 'yellow',
  name: 'Valencia',
  isPort: true,
  connectedTo: [{ name: 'Taragona' }, { name: 'Palma de Mallorca', cannotBuildRailRoad: true }, { name: 'Alicante' }, { name: 'Albacete' }, { name: 'Cuenca' }],
  position: { column: 17, row: 11 }
}, {
  color: 'yellow',
  name: 'Palma de Mallorca',
  isPort: true,
  connectedTo: [{ name: 'Barcelona', cannotBuildRailRoad: true }, { name: 'Valencia', cannotBuildRailRoad: true }],
  position: { column: 23, row: 11 }
}, {
  color: 'yellow',
  name: 'Albacete',
  connectedTo: [{ name: 'Cuenca' }, { name: 'Valencia' }, { name: 'Cartagena' }, { name: 'Jaen' }, { name: 'Ciudad Real' }],
  position: { column: 15, row: 12 }
}, {
  color: 'yellow',
  name: 'Alicante',
  isPort: true,
  connectedTo: [{ name: 'Valencia' }, { name: 'Cartagena' }],
  position: { column: 17, row: 14 }
}, {
  color: 'yellow',
  name: 'Cartagena',
  isPort: true,
  connectedTo: [{ name: 'Alicante' }, { name: 'Almeria' }, { name: 'Albacete' }],
  position: { column: 16, row: 16 }
}]