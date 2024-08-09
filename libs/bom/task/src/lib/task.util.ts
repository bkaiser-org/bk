import { Importance, Importances, ModelType, Priorities, Priority, TaskState, TaskStates, getCategoryName } from "@bk/categories";
import { TaskFormModel, TaskModel } from "@bk/models";

export function getTaskSearchIndex(task: TaskModel): string {
  return 'n:' + task.name + ' p:' + getCategoryName(Priorities, task.priority) + ' i:' + getCategoryName(Importances, task.importance) + ' t:' + getCategoryName(TaskStates, task.category);
}

export function getTaskSearchIndexInfo(): string {
  return 'n:ame p:riority i:mportance t:ype';
}

export function getTaskTitle(taskKey: string | undefined): string {
  const _operation = !taskKey ? 'create' : 'update';
  return `@task.operation.${_operation}.label`;  
}

export function newTaskFormModel(): TaskFormModel {
  return {
    bkey: '',
    name: '',
    taskState: TaskState.Initial,
    author: '',
    assignee: '',
    dueDate: '',
    priority: Priority.Medium,
    importance: Importance.Medium,
    url: '',
    notes: '',
    tags: '',
    modelType: ModelType.Task
  }
}


export function convertTaskToForm(task?: TaskModel, author?: string): TaskFormModel {
  if (!task) {
    const _taskForm = newTaskFormModel();
    _taskForm.author = author ?? '';
    return _taskForm;
  }
  return {
    bkey: task.bkey,
    name: task.name,
    taskState: task.category,
    author: task.author,
    assignee: task.assignee,
    dueDate: task.dueDate,
    priority: task.priority,
    importance: task.importance,
    url: task.url,
    notes: task.description,
    tags: task.tags
  }
}

export function convertFormToTask(task: TaskModel | undefined, vm: TaskFormModel): TaskModel {
  if (!task) {
    task = new TaskModel();
  }
  const _bkey = vm.bkey;
  if (_bkey?.length === 0) throw new Error('TaskUtil.convertFormToTask: bkey is mandatory.');
  task.bkey = _bkey; 
  task.name = vm.name ?? '';
  task.category = vm.taskState ?? TaskState.Initial;
  task.author = vm.author ?? '';
  task.assignee = vm.assignee ?? '';
  task.dueDate = vm.dueDate ?? '';
  task.priority = vm.priority ?? Priority.Medium;
  task.importance = vm.importance ?? Importance.Medium;
  task.url = vm.url ?? '';
  task.tags = vm.tags ?? '';
  task.description = vm.notes ?? '';
  return task;
}