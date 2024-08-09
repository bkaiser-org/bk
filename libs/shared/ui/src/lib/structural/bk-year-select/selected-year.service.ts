import {Injectable}      from '@angular/core'
import { DateFormat, getTodayStr } from '@bk/util';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SelectedYearService {
  private _selectedYear = new BehaviorSubject<number>(Number(getTodayStr(DateFormat.Year)));
  public selectedYear$ = this._selectedYear.asObservable();

  public changeYear(year: number): void {
    this._selectedYear.next(year);
  }

  public reset(): void {
    this._selectedYear.next(Number(getTodayStr(DateFormat.Year)));
  }
}