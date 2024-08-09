import { only, staticSuite} from 'vest';
import { stringValidations } from '../primitive-validations/string.validations';
import { categoryValidations } from '../primitive-validations/category.validations';
import { dateValidations } from '../primitive-validations/date.validations';
import { SHORT_NAME_LENGTH } from '@bk/util';
import { Importance, ModelType, Priority, TaskState } from '@bk/categories';
import { numberValidations } from '../primitive-validations/number.validations';
import { baseValidations } from '../base/base.validations';
import { TaskModel } from './task.model';

export const taskValidations = staticSuite((model: TaskModel, field?: string) => {
  if (field) only(field);

  baseValidations(model, field);
  stringValidations('author', model.author, SHORT_NAME_LENGTH);
  stringValidations('assignee', model.assignee, SHORT_NAME_LENGTH);
  dateValidations('dueDate', model.dueDate);
  numberValidations('modelType', model.modelType, true, ModelType.Task, ModelType.Task);
  categoryValidations('priority', model.priority, Priority);
  categoryValidations('importance', model.importance, Importance);
  categoryValidations('category', model.category, TaskState);

  // cross collection validations
});

