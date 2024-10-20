import { Table, TableConfig } from "@bk/models";

export function newTableConfig(): TableConfig {
  return {
    gridTemplate: 'auto auto',
    gridGap: '1px',
    gridBackgroundColor: 'grey',
    gridPadding: '1px',
    headerBackgroundColor: 'lightgrey',
    headerTextAlign: 'center',
    headerFontSize: '1rem',
    headerFontWeight: 'bold',
    headerPadding: '5px',
    cellBackgroundColor: 'white',
    cellTextAlign: 'left',
    cellFontSize: '0.8rem',
    cellFontWeight: 'normal',
    cellPadding: '5px'
  };
}

export function newTable(): Table {
  return {
    config: newTableConfig(),
    header: [],
    content: []
  }
}
