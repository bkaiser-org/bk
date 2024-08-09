import { DbQuery } from "@bk/categories";

export function getRangeQuery(key: string, lowValue: number | string, highValue: number | string, isTest = false, isArchived = false): DbQuery[] {
  return [
    { key: 'isTest', operator: '==', value: isTest },
    { key: 'isArchived', operator: '==', value: isArchived },
    { key: key, operator: '>=', value: lowValue },
    { key: key, operator: '<=', value: highValue }
  ]
}
