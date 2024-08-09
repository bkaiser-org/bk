import { Component, computed, inject, input } from '@angular/core';
import { ModelType, ResourceTypes } from '@bk/categories';
import { RelationshipModel } from '@bk/models';
import { AvatarPipe, BkSpinnerComponent } from '@bk/ui';
import { CategoryNamePipe, DurationPipe, TranslatePipe } from '@bk/pipes';
import { IonAccordion, IonAvatar, IonButton, IonButtons, IonIcon, IonImg, IonItem, IonItemOption, IonItemOptions, IonItemSliding, IonLabel, IonList } from '@ionic/angular/standalone';
import { OwnershipService } from './ownership.service';
import { AuthorizationService } from '@bk/base';
import { AsyncPipe } from '@angular/common';
import { navigateByUrl } from '@bk/util';
import { Router } from '@angular/router';

@Component({
    selector: 'bk-ownerships-accordion',
    standalone: true,
    imports: [
      TranslatePipe, CategoryNamePipe, AvatarPipe, AsyncPipe, DurationPipe,
      BkSpinnerComponent,
      IonAccordion, IonItem, IonLabel, IonList, IonButtons, IonButton, IonIcon,
      IonAvatar, IonImg, IonItemSliding, IonItemOptions, IonItemOption
    ],
    template: `
    <ion-accordion toggle-icon-slot="start" value="ownerships">
      <ion-item slot="header" color="primary">
        <ion-label>{{ '@ownership.plural' | translate | async }}</ion-label>
        @if(authorizationService.hasRole('resourceAdmin')) {
        <ion-button fill="outline" (click)="addOwnership()">
          <ion-icon color="secondary" slot="icon-only" name="add-circle-outline" />
        </ion-button>
      }
      </ion-item>
      <div slot="content">
        @if((ownerships$() | async); as ownerships) {
          <ion-list lines="none">
            @if(ownerships.length === 0) {
              <ion-item>
                <ion-label>{{ '@general.noData.ownerships' | translate | async }}</ion-label>
              </ion-item>
            } @else {
              @for(ownership of ownerships; track ownership.bkey) {
                <ion-item-sliding #slidingItem>
                  <ion-item (click)="editResource(ownership.objectKey)">
                    <ion-avatar slot="start">
                      <ion-img [src]="'4.' + ownership.objectKey | avatar | async" />
                    </ion-avatar>
                    <ion-label>
                      @if(ownership.objectType === MT.Resource) {
                          {{ ownership.objectCategory | categoryName:RT }}
                      }
                      @if(ownership.objectType === MT.Boat) {
                          {{ '@resource.type.rowingBoat.label' | translate | async }}
                      }
                      : {{ ownership.objectName }}
                    </ion-label>
                    <ion-label>{{ ownership.validFrom | duration:ownership.validTo }}</ion-label>
                  </ion-item>
                  @if(authorizationService.hasRole('resourceAdmin')) {
                    <ion-item-options side="end">
                      <ion-item-option color="danger" (click)="endOwnership(slidingItem, ownership)"><ion-icon slot="icon-only" name="trash-outline" /></ion-item-option>
                      <ion-item-option color="primary" (click)="editOwnership(slidingItem, ownership)"><ion-icon slot="icon-only" name="create-outline" /></ion-item-option>
                    </ion-item-options>
                  }
                </ion-item-sliding>
              }
            }
          </ion-list>
        } @else {
          <bk-spinner />
        }
      </div>
    </ion-accordion>
    `
})
export class BkOwnershipsComponent {
  private ownershipService = inject(OwnershipService);
  public authorizationService = inject(AuthorizationService);
  private router = inject(Router);

  public subjectKey = input.required<string>();
  protected ownerships$ = computed(() => this.ownershipService.listOwnershipsOfSubject(this.subjectKey()));

  public RT = ResourceTypes;
  public MT = ModelType;

  public async addOwnership(): Promise<void> {
    await this.ownershipService.createNewOwnershipFromSubject(this.subjectKey());
  }

  public async editOwnership(slidingItem: IonItemSliding, ownership: RelationshipModel): Promise<void> {
    if (slidingItem) slidingItem.close();
    if (this.authorizationService.hasRole('resourceAdmin')) {
      await this.ownershipService.editOwnership(ownership);
    }
  }

  public async endOwnership(slidingItem: IonItemSliding, ownership: RelationshipModel): Promise<void> {
    if (slidingItem) slidingItem.close();
    await this.ownershipService.endOwnership(ownership);
  }

  public async editResource(resourceKey: string): Promise<void> {
    if (this.authorizationService.hasRole('resourceAdmin')) {
      navigateByUrl(this.router, `/resource/${resourceKey}`);    
    }
  }
}
