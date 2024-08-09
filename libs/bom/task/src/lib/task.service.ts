import { Injectable } from '@angular/core';
import { BaseService } from '@bk/base';
import { Observable } from 'rxjs';
import { TaskModel } from '@bk/models';
import { CollectionNames, die } from '@bk/util';
import { getTaskSearchIndex, getTaskSearchIndexInfo } from './task.util';

@Injectable({
  providedIn: 'root'
})
export class TaskService extends BaseService {

  constructor() {
    super();
  }

  /*-------------------------- CRUD operations --------------------------------*/
  /**
   * Save a new task into the database.
   * @param task the new task to be saved
   * @returns the document id of the new TaskModel in the database
   */
  public async createTask(task: TaskModel): Promise<string> {
    task.index = getTaskSearchIndex(task);
    const _key = await this.dataService.createModel(CollectionNames.Task, task, '@task.operation.create');
    await this.saveComment(CollectionNames.Task, _key, '@comment.operation.initial.conf');
    return _key;
  }

  /**
   * Read a task from the database by returning an Observable of a TaskModel by uid.
   * @param firestore a handle to the Firestore database
   * @param uid the key of the task to be read
   */
  public readTask(key: string): Observable<TaskModel> {
    return this.dataService.readModel(CollectionNames.Task, key) as Observable<TaskModel>;
  }

  public async loadTasks(keys: string[]): Promise<TaskModel[]> {
    return await this.dataService.readModels(CollectionNames.Task, keys) as TaskModel[];
  }


  /**
   * Update an existing task with new values.
   * @param task the TaskModel with the new values
   */
  public async updateTask(task: TaskModel): Promise<void> {
    if (!task?.bkey?.length) die('TaskService.updateTask: bkey is mandatory.' );
    task.index = this.getSearchIndex(task);
    await this.dataService.updateModel(CollectionNames.Task, task, `@task.operation.update`);
  }

  /**
   * Delete an existing task in the database by archiving it.
   * @param task the TaskModel to be deleted.
   */
  public async deleteTask(task: TaskModel): Promise<void> {
    task.isArchived = true;
    await this.dataService.updateModel(CollectionNames.Task, task, `@task.operation.delete`);
  }

  /*-------------------------- LIST operations --------------------------------*/
 /**
   * List all tasks.
   * @param orderBy 
   * @param sortOrder 
   * @returns 
   */
  public listAllTasks(orderBy = 'name', sortOrder = 'asc'): Observable<TaskModel[]> {
    return this.dataService.listAllModels(CollectionNames.Task, orderBy, sortOrder) as Observable<TaskModel[]>;
  }

  /*-------------------------- search index --------------------------------*/
  public getSearchIndex(task: TaskModel): string {
    return getTaskSearchIndex(task);
  }

  public getSearchIndexInfo(): string {
    return getTaskSearchIndexInfo();
  }
}

