import { AfterViewInit, Component, inject, model, output, signal } from '@angular/core';
import { IonCol, IonGrid, IonInput, IonRow, ModalController } from '@ionic/angular/standalone';
import { AbstractFormComponent } from '@bk/base';
import { BkCatInputComponent, BkNotesComponent, BkPropertyListComponent, BkSpinnerComponent, BkStringsComponent, BkTagsComponent, BkTextInputComponent, BkUrlComponent } from '@bk/ui';
import { MenuItemFormModel, menuItemFormModelShape, menuItemFormValidation } from '@bk/models';
import { MenuAction, MenuActions, RoleEnum, RoleEnums } from '@bk/categories';
import { MenuItemTags, NAME_LENGTH } from '@bk/util';
import { vestForms } from 'ngx-vest-forms';

@Component({
  selector: 'bk-menu-item-form',
  standalone: true,
  imports: [
    vestForms,
    BkTextInputComponent, BkUrlComponent, BkCatInputComponent, BkTagsComponent, BkNotesComponent, 
    BkSpinnerComponent, BkStringsComponent, BkPropertyListComponent,
    IonGrid, IonRow, IonCol, IonInput
],
  template: `
  @if(vm(); as vm) {
  <form scVestForm
    [formShape]="shape"
    [formValue]="formValue()"
    [suite]="suite" 
    (formValueChange)="formValue.set($event)">

    <ion-grid>
      <!---------------------------------------------------
        CHANNEL, USAGE, VALUE 
        --------------------------------------------------->
      <ion-row>
        <ion-col size="12" size-md="6">                                               <!-- name -->
          <bk-text-input name="name" [value]="vm.name!" (changed)="updateField('name', $event)" [autofocus]="true" [maxLength]=30 [showError]=true [showHelper]=true [readOnly]="readOnly()" />                                        
        </ion-col>

        <ion-col size="12" size-md="6">                                               <!-- menuAction -->
          <bk-cat-input name="menuAction" [value]="vm.category ?? menuAction.Navigate" [categories]="menuActions" (changed)="updateField('category', $event)" [readOnly]="readOnly()" />
        </ion-col>
      </ion-row>

      @if(vm.category === MA.Navigate || vm.category === MA.Browse) {
        <ion-row>
          <ion-col size="12" size-md="6">                                             <!-- icon -->
            <bk-text-input name="icon" [value]="vm.icon!" (changed)="updateField('icon', $event)" [readOnly]="readOnly()" [maxLength]="nameLength" [showHelper]=true [showError]=true />
          </ion-col>

          <ion-col size="12" size-md="6">                                             <!-- label -->
            <bk-text-input name="label" [value]="vm.label!" (changed)="updateField('label', $event)" [readOnly]="readOnly()" [showHelper]=true />
          </ion-col>

          <ion-col size="12" size-md="6">                                               <!-- url -->
            <bk-url name="route" [value]="vm.url ?? ''" (changed)="updateField('url', $event)" [showHelper]=true [showError]=true />
          </ion-col>
        </ion-row>
      } @else { <!-- SubMenu, Divider, MainMenu -->
        @if(vm.category !== MA.MainMenu) {
          <ion-row>
            <ion-col size="12">                                             <!-- label -->
              <bk-text-input name="label" [value]="vm.label!" (changed)="updateField('label', $event)" [readOnly]="readOnly()" [showHelper]=true />
            </ion-col>
          </ion-row>
        }
      }
      @if(vm.category === MA.Navigate || vm.category === MA.Browse || vm.category === MA.SubMenu || vm.category === MA.Divider) {
        <ion-row>
          <ion-col size="12">                                             <!-- roleNeeded -->
            <bk-cat-input name="roleNeeded" [value]="vm.roleNeeded ?? role.Registered" [categories]="roles" (changed)="updateField('roleNeeded', $event)" [readOnly]="readOnly()" />
          </ion-col>
        </ion-row>
      }
      @if(vm.category === MA.SubMenu || vm.category === MA.MainMenu) {
        <ion-row>
          <ion-col size="12">                                             <!-- menuItems -->
            <bk-strings [strings]="vm.menuItems!" (stringsChanged)="onMenuChange($event)" title="@input.strings.menuTitle" addLabel="@input.strings.addMenu" />
          </ion-col>
        </ion-row>
      }
      @if(vm.category === MA.Navigate || vm.category === MA.Browse) {
        <ion-row>
          <ion-col size="12">                                             <!-- menuItems -->
            <bk-property-list [propertyList]="vm.data!" (propertiesChanged)="onChange()" />
          </ion-col>
        </ion-row>
      }

      <!---------------------------------------------------
        TAG, NOTES 
        --------------------------------------------------->
      @if(authorizationService.isPrivileged()) {
        <ion-row>                                                                        <!-- tags -->
          <ion-col>
            <bk-tags storedTags="{{vm.tags}}" [allTags]="menuItemTags" (changedTags)="onTagsChanged($event)" [readOnly]="readOnly()" />
          </ion-col>
        </ion-row>
      }

      @if(authorizationService.isAdmin()) {
        <ion-row>                                                                       <!-- notes -->
          <ion-col>
          <bk-notes [value]="vm.notes ?? ''" (changed)="updateField('notes', $event)" />
          </ion-col>
        </ion-row>    
      }
    </ion-grid>
  </form>
} @else {
  <bk-spinner />
}
`
})
export class MenuItemFormComponent extends AbstractFormComponent implements AfterViewInit {
  protected modalController = inject(ModalController);
  public vm = model.required<MenuItemFormModel>();
  public changedUrl = output<string>();

  protected readonly suite = menuItemFormValidation;
  protected readonly formValue = signal<MenuItemFormModel>({});
  protected shape = menuItemFormModelShape;
  protected readonly errors = signal<Record<string, string>>({ });

  public MA = MenuAction;
  protected nameLength = NAME_LENGTH;
  protected menuItemTags = MenuItemTags;
  protected role = RoleEnum;
  protected roles = RoleEnums;
  protected menuAction = MenuAction;
  protected menuActions = MenuActions;
  
  ngAfterViewInit() {
    this.resetForm();
  }
  
  protected onMenuChange(menuItems: string[]): void {
    this.updateField('menuItems', menuItems);
  }

  protected onChange(): void {
    this.formDirty.set(true);
    this.notifyState();
  }
}