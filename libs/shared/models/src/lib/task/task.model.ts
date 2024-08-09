import { Importance, ModelType, Priority } from '@bk/categories';
import { BASE_FIELDS, BaseModel, FieldDescription } from '../base/base.model';

export class TaskModel extends BaseModel {
    // name: a meaningful name for the task
    // category : TaskState: the state of the task (input with taskName:todoText)
    // url: can be used with a task to link to additional information
    // tags: topics used to categorize the tasks (input with taskName:todoText)
    // description: a detailed description of the task
    public author = ''; // subject.bkey: the person who created the task
    public assignee = ''; // subject.bkey: the person, group or org responsible for execution
    public dueDate = ''; // date when the task should be completed
    public priority = Priority.Medium; // 0: low, 1: medium, 2: high
    public importance = Importance.Medium; // 0: low, 1: medium, 2: high

    constructor() {
        super();
        this.modelType = ModelType.Task;
    }
}

export const TASK_FIELDS: FieldDescription[] = [
  { name: 'assignee',   label: 'assignee',   value: true },
  { name: 'dueDate',     label: 'dueDate',   value: true },
  { name: 'priority',     label: 'priority',   value: true },
  { name: 'importance',     label: 'importance',   value: true },

];
export const ALL_TASK_FIELDS = BASE_FIELDS.concat(TASK_FIELDS);
