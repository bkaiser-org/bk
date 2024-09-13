import { SortCriteria } from "@bk/util";
import { BaseModel } from "./base.model";

export interface DataState {
  listType: number,
  groupedItems: BaseModel[],
  filteredItems: BaseModel[],
  searchTerm: string,
  selectedYear: number,
  selectedCategory: number,
  selectedTag: string,
  currentSortCriteria: SortCriteria,
  error: string,
  status: "success" | "error" | "loading",
  currentKey: string
}