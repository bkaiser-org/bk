import { Pipe, PipeTransform } from '@angular/core';
import { BaseModel, SubjectModel } from '@bk/models';
import { ModelType, SectionTypes, getCategoryName } from '@bk/categories';
import { NameDisplay, getFullPersonName } from '@bk/util';

@Pipe({
  name: 'nameByModel',
  standalone: true
})
export class NameByModelPipe implements PipeTransform {

  transform(model: BaseModel, nameDisplay = NameDisplay.FirstLast): string {
    switch(model.modelType) {
      case ModelType.Person:
        return getFullPersonName((model as SubjectModel).firstName, model.name, '', nameDisplay);
      case ModelType.Section:
        return model.name + '                  (' + getCategoryName(SectionTypes, model.category) + ')';
      default: 
        return model.name;
    }
  }
}