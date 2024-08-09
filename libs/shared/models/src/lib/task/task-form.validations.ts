import { enforce, only, staticSuite, test} from 'vest';
import { stringValidations } from '../primitive-validations/string.validations';
import { categoryValidations } from '../primitive-validations/category.validations';
import { dateValidations } from '../primitive-validations/date.validations';
import { DESCRIPTION_LENGTH, SHORT_NAME_LENGTH } from '@bk/util';
import { Importance, ModelType, Priority, TaskState } from '@bk/categories';
import { numberValidations } from '../primitive-validations/number.validations';
import { TaskFormModel } from './task-form.model';

export const taskFormValidations = staticSuite((model: TaskFormModel, field?: string) => {
  if (field) only(field);

  stringValidations('bkey', model.bkey, SHORT_NAME_LENGTH);
  stringValidations('name', model.name, SHORT_NAME_LENGTH);
  categoryValidations('category', model.taskState, TaskState);
  stringValidations('url', model.url, SHORT_NAME_LENGTH);
  stringValidations('tags', model.tags, SHORT_NAME_LENGTH);
  stringValidations('description', model.notes, DESCRIPTION_LENGTH);

  stringValidations('author', model.author, SHORT_NAME_LENGTH);
  stringValidations('assignee', model.assignee, SHORT_NAME_LENGTH);
  dateValidations('dueDate', model.dueDate);
  numberValidations('modelType', model.modelType, true, ModelType.Task, ModelType.Task);
  categoryValidations('priority', model.priority, Priority);
  categoryValidations('importance', model.importance, Importance);

  test('modelType', 'taskModelType', () => {
    enforce(model.modelType).equals(ModelType.Task);
  });

  // cross collection validations
});

