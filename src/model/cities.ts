export type City = {
  color: 'red' | 'blue' | 'yellow' | 'black'
  name: CityName
  connectedTo: CityName[]
  isPort: boolean
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


export const cities: City[] = [
  {color: 'blue', name: 'A Coruna', connectedTo: ['Santiago De Compostela', 'Gijon'], isPort: true},
  {color: 'blue', name: 'Santiago De Compostela', connectedTo: ['A Coruna', 'Vigo', 'Ourense'], isPort: false},
  {color: 'blue', name: 'Vigo', connectedTo: ['Santiago De Compostela', 'Porto', 'Ourense', 'Braga'], isPort: true},
  {color: 'blue', name: 'Ourense', connectedTo: ['Santiago De Compostela', 'Vigo', 'Leon'], isPort: false}
]