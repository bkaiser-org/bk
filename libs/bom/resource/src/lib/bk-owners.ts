import { Component, computed, inject, input } from '@angular/core';
import { ModelType } from '@bk/categories';
import { RelationshipModel } from '@bk/models';
import { AvatarPipe, BkSpinnerComponent } from '@bk/ui';
import { DurationPipe, FullNamePipe, SvgIconPipe, TranslatePipe } from '@bk/pipes';
import { NameDisplay } from '@bk/util';
import { ResourceService } from './resource.service';
import { IonAccordion, IonAvatar, IonButton, IonButtons, IonIcon, IonImg, IonItem, IonItemOption, IonItemOptions, IonItemSliding, IonLabel, IonList } from '@ionic/angular/standalone';
import { AsyncPipe } from '@angular/common';
import { AuthorizationService } from '@bk/base';
import { OwnershipService } from '@bk/ownership';

@Component({
    selector: 'bk-owners',
    standalone: true,
    imports: [
      TranslatePipe, FullNamePipe, AvatarPipe, AsyncPipe, DurationPipe, SvgIconPipe,
      BkSpinnerComponent,
      IonAccordion, IonItem, IonLabel, IonButton, IonIcon, IonList, IonButtons,
      IonAvatar, IonImg, IonItemSliding, IonItemOptions, IonItemOption
    ],
    template: `
    <ion-accordion toggle-icon-slot="start" value="owners">
      <ion-item slot="header" color="primary">
          <ion-label>{{ '@input.owner.label' | translate | async }}</ion-label>
          <ion-label>{{ '@input.duration.label' | translate | async }}</ion-label>
          <ion-label>{{ '@input.price.label' | translate | async  }}</ion-label>
          @if(authorizationService.hasRole('resourceAdmin')) {
            <ion-button fill="outline" (click)="addOwner()">
              <ion-icon color="secondary" slot="icon-only" src="{{'add-circle-outline' | svgIcon }}" />
            </ion-button>
          }
      </ion-item>
      <div slot="content">
        @if((ownerships$() | async); as ownerships) {
          <ion-list lines="none">
            @if(ownerships.length === 0) {
              <ion-item>
                <ion-label>{{ '@general.noData.owners' | translate | async }}</ion-label>
              </ion-item>
            } @else {
              @for(ownership of ownerships; track ownership.bkey) {
                <ion-item-sliding #slidingItem>
                  <ion-item (click)="editOwner(ownership.subjectKey, ownership.subjectType)">
                    <ion-avatar slot="start">
                      <ion-img [src]="'0.' + ownership.subjectKey | avatar | async" />
                    </ion-avatar>
                    <ion-label>{{ownership.subjectName | fullName:ownership.subjectName2:ND.FirstLast }}</ion-label>
                    <ion-label slot="end">{{ ownership.validFrom | duration:ownership.validTo }}</ion-label>
                    <ion-label slot="end">{{ ownership.price }}</ion-label>
                  </ion-item>
                  <ion-item-options side="end">
                    @if(authorizationService.isPrivilegedOr('resourceAdmin')) {
                      <ion-item-option color="danger" (click)="endOwnership(slidingItem, ownership)">
                        <ion-icon slot="icon-only" src="{{'trash-outline' | svgIcon }}" />
                      </ion-item-option>
                      <ion-item-option color="primary" (click)="editOwnership(slidingItem, ownership)">
                        <ion-icon slot="icon-only" src="{{'create-outline' | svgIcon }}" />
                      </ion-item-option>
                    }
                  </ion-item-options>
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
export class BkOwnersComponent {
    private resourceService = inject(ResourceService);
    private ownershipService = inject(OwnershipService);
    public authorizationService = inject(AuthorizationService);

    public resourceKey = input.required<string>();  // parent is always a resource
    // an owner is currently just a person, later it can also be an org (or an AdressableUnit)
    protected ownerships$ = computed(() => this.ownershipService.listOwnersOfResource(this.resourceKey()));

    public ND = NameDisplay;
  
    public async addOwner(): Promise<void> {
      this.ownershipService.createNewOwnershipFromResource(this.resourceKey());
    }

    public async editOwnership(slidingItem: IonItemSliding, ownership: RelationshipModel): Promise<void> {
      if (slidingItem) slidingItem.close();
      if (this.authorizationService.hasRole('resourceAdmin')) {
        await this.ownershipService.editOwnership(ownership);
      }
    }

    public async editOwner(personKey: string, modelType: ModelType): Promise<void> {
        await this.resourceService.editOwner(personKey, modelType, this.resourceKey());
    }

    public async endOwnership(slidingItem: IonItemSliding, ownership: RelationshipModel): Promise<void> {
      if (slidingItem) slidingItem.close();
        await this.ownershipService.endOwnership(ownership);
    }
}
