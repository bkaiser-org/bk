import { Importance, Priority } from "@bk/categories";
import { DeepPartial, DeepRequired } from 'ngx-vest-forms';

export type TaskFormModel = DeepPartial<{
  bkey: string,
  name: string,
  taskState: number,
  author: string,
  assignee: string,
  dueDate: string,
  priority: Priority,
  importance: Importance,
  url: string,
  notes: string,
  tags: string,
  modelType: number
}>;

export const taskFormModelShape: DeepRequired<TaskFormModel> = {
  bkey: '',
  name: '',
  taskState: -1,
  author: '',
  assignee: '',
  dueDate: '',
  priority: Priority.Medium,
  importance: Importance.Medium,
  url: '',
  notes: '',
  tags: '',
  modelType: -1
};