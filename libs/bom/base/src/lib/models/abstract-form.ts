import { inject, Component, signal, output, ModelSignal, input } from '@angular/core';
import { BkFormModel, SectionProperties } from '@bk/models';
import { AuthorizationService } from '../authorization/authorization.service';
import { AppNavigationService, ENV, copyToClipboard, showToast } from '@bk/util';
import { ToastController } from '@ionic/angular';
import { StaticSuite } from 'vest';
import { Category } from '@bk/categories';

@Component({
  template: '',
  standalone: true
})
export abstract class AbstractFormComponent {
  public authorizationService = inject(AuthorizationService);
  protected appNavigationService = inject(AppNavigationService);
  protected toastController = inject(ToastController);
  protected env = inject(ENV);

  public changedData = output<BkFormModel>();
  public changedFormState = output<boolean>();
  protected errorMessage = output<string>();

  protected isModal = false; // set to true if the form is used in a modal dialog

  abstract vm: ModelSignal<BkFormModel>;
  public readOnly = input(false);
  protected abstract suite: StaticSuite<string, string>;

  protected readonly formValid = signal<boolean>(false);
  protected readonly formDirty = signal<boolean>(false);

  protected resetForm(): void {
    this.formValid.set(false);
    this.formDirty.set(false);
    this.notifyState();
  }

  protected notifyState(): void {
    this.changedFormState.emit(this.formValid() && this.formDirty());
    this.changedData.emit(this.vm());
  }

  protected updateField(fieldName: keyof BkFormModel, value: string | string[] | number | boolean): void {
    this.vm.update((_vm) => ({..._vm, [fieldName]: value}));
    this.checkFormValidity();
  }

  protected updateSectionProperties(properties: SectionProperties): void {
    this.vm.update((_vm) => ({..._vm, sectionProperties: properties}));
    this.checkFormValidity();
  }

  /**
   * Update the tags in the view model.
   * @param tags the new tags, i.e. a comma separated list of tag names.
   */
  protected onTagsChanged(tags: string): void {
    this.updateField('tags', tags);
  }

  protected onCategoryChange($event: Event, fieldName: keyof BkFormModel): number {
    const _category = ($event.target as HTMLInputElement).value as unknown as Category;
    this.updateField(fieldName, _category.id);
    return _category.id;
  }

  /* --------------------------- form handling --------------------------- */
  private checkFormValidity(): void {
    this.formDirty.set(true);
    const _result = this.suite(this.vm());
    if (_result.hasErrors()) {
      let _errorMessage = _result.errors[0].message;
      if (_errorMessage && _errorMessage.length > 0) {
        _errorMessage = `@validation.${_errorMessage}`;
        // print out more information to find the exact validation error
        if (this.env.production === false) {
          console.log(this.vm());
          console.log(_result);
        }
      }
      console.warn(_errorMessage);
      this.errorMessage.emit(_errorMessage ?? '');
      this.formValid.set(false);
    } else {
      this.errorMessage.emit('');
      this.formValid.set(true);
    }
    this.notifyState();
  }

  protected onValidChange($event: boolean | null): void {
    this.formValid.set($event ?? false);
    this.notifyState();
  }

  protected onDirtyChange($event: boolean | null): void {
    this.formDirty.set($event ?? false);
    this.notifyState();
  }

  /* --------------------------- general functionality --------------------------- */
  protected copyValue(fieldName: keyof BkFormModel): void {
    if (fieldName === 'sectionProperties' || fieldName=== 'relationshipProperties') return;
    copyToClipboard(this.vm()?.[fieldName] ?? '');
    showToast(this.toastController, '@general.operation.copy.conf', this.env.settingsDefaults.toastLength);
  }
}
