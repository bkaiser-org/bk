import { Component, computed, input, output } from '@angular/core';
import { BkCatComponent } from '../category/bk-cat/bk-cat';
import { Category, CategoryConfig } from '@bk/categories';
import { vestFormsViewProviders } from 'ngx-vest-forms';

@Component({
  selector: 'bk-cat-input',
  standalone: true,
  imports: [
    BkCatComponent
  ],
  viewProviders: [vestFormsViewProviders],
  template: `
    <bk-cat [name]="name()" [config]="config()" [readOnly]="readOnly()" (ionChange)="onCategoryChange($event)" />
  `
})
export class BkCatInputComponent {
  public value = input.required<number>(); // mandatory view model
  public categories = input.required<Category[]>(); // mandatory view model
  public name = input.required<string>(); // mandatory name of the input field
  public readOnly = input(false); // if true, the input field is read-only
  public changed = output<number>();

  public config = computed(() => ({
    categories: this.categories(),
    selectedCategoryId: this.value(),
    label: '@input.' + this.name() + '.label'
  }) as CategoryConfig)

  public onCategoryChange($event: Event): void {
    const _category = ($event.target as HTMLInputElement).value as unknown as Category;
    this.changed.emit(_category.id);
  }
}
