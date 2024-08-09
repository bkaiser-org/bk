export interface GraphDataRow {
    name: string,
    value: number
  }
  
  export interface GraphDataSeries {
    name: string,
    series: GraphDataRow[]
  }
