import { Injectable } from '@angular/core';
import { BaseService } from '@bk/base';
import { Observable } from 'rxjs';
import { BaseModel, CompetitionLevelModel, isCompetitionLevel } from '@bk/models';
import { CollectionNames, die } from '@bk/util';
import { getCompetitionLevelIndex, getCompetitionLevelIndexInfo } from './competition-level.util';

@Injectable({
  providedIn: 'root'
})
export class CompetitionLevelService extends BaseService {

  /*-------------------------- CRUD operations --------------------------------*/
  /**
   * Lookup a CompetitionLevelModel from the database by its document ID and return it as an Observable.
   * @param key the document id of the CompetitionLevelModel
   */
  public readCompetitionLevel(key: string): Observable<CompetitionLevelModel> {
    if (!key) die('CompetitionLevelService.readCompetitionLevel: key is mandatory');
    return this.dataService.readModel(CollectionNames.CompetitionLevel, key) as Observable<CompetitionLevelModel>;
  }

  public async updateCompetitionLevel(competitionLevelModel: CompetitionLevelModel): Promise<void> {
    competitionLevelModel.index = getCompetitionLevelIndex(competitionLevelModel);
    this.dataService.updateModel(CollectionNames.CompetitionLevel, competitionLevelModel, 'competitionLevel.operation.update');
  }
  
  public async deleteCompetitionLevel(competitionLevelModel: CompetitionLevelModel): Promise<void> {
    competitionLevelModel.index = getCompetitionLevelIndex(competitionLevelModel);
    this.dataService.updateModel(CollectionNames.CompetitionLevel, competitionLevelModel, 'competitionLevel.operation.delete');
  }

    /*-------------------------- search index --------------------------------*/
    public getSearchIndex(item: BaseModel): string {
      return (isCompetitionLevel(item)) ? getCompetitionLevelIndex(item) : '';
    }
  
    public getSearchIndexInfo(): string {
      return getCompetitionLevelIndexInfo();
    }
  
}
