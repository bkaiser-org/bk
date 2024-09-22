import { Component, computed, inject, input } from '@angular/core';
import { RelationshipModel } from '@bk/models';
import { AvatarPipe, BkSpinnerComponent } from '@bk/ui';
import { DurationPipe, MemberCategoryPipe, SvgIconPipe, TranslatePipe } from '@bk/pipes';
import { navigateByUrl } from '@bk/util';
import { AuthorizationService, DataService } from '@bk/base';
import { IonAccordion, IonAvatar, IonButton, IonButtons, IonIcon, IonImg, IonItem, IonItemOption, IonItemOptions, IonItemSliding, IonLabel, IonList, ModalController } from '@ionic/angular/standalone';
import { AsyncPipe } from '@angular/common';
import { ListType } from '@bk/categories';
import { Router } from '@angular/router';
import { MembershipService } from './membership.service';
import { MembershipEditModalComponent } from './membership-edit.modal';

@Component({
  selector: 'bk-memberships-accordion',
  standalone: true,
  imports: [
    TranslatePipe, AvatarPipe, MemberCategoryPipe, DurationPipe, AsyncPipe, SvgIconPipe,
    BkSpinnerComponent, MembershipEditModalComponent,
    IonAccordion, IonItem, IonLabel, IonButton, IonIcon, IonList, IonButtons,
    IonAvatar, IonImg, IonItemSliding, IonItemOptions, IonItemOption
  ],
  template: `
  <ion-accordion toggle-icon-slot="start" value="memberships">
    <ion-item slot="header" [color]="color()">
      <ion-label>{{ title() | translate | async }}</ion-label>
      @if(authorizationService.hasRole('memberAdmin')) {
        <ion-button fill="outline" (click)="addMembership()">
          <ion-icon color="secondary" slot="icon-only" src="{{'add-circle-outline' | svgIcon }}" />
        </ion-button>
      }
    </ion-item>
    <div slot="content">
      @if((memberships$() | async); as memberships) {
        <ion-list lines="none">
          @if(memberships.length === 0) {
            <ion-item>
              <ion-label>{{ '@general.noData.memberships' | translate | async }}</ion-label>
            </ion-item>
          } @else {
            @for(membership of memberships; track membership.bkey) {
              <ion-item-sliding #slidingItem>
                <ion-item (click)="editOrg(membership.objectKey)">
                  <ion-avatar slot="start">
                    <ion-img [src]="'2.' + membership.objectKey | avatar | async" />
                  </ion-avatar>
                  <ion-label>{{ membership.objectName }}</ion-label>
                  <ion-label>{{ membership.subType | memberCategory:membership.objectKey }} / {{ membership.validFrom | duration:membership.validTo }}</ion-label>
                </ion-item>
                @if(authorizationService.hasRole('memberAdmin')) {
                  <ion-item-options side="end">
                    <ion-item-option color="danger" (click)="endMembership(slidingItem, membership)">
                      <ion-icon slot="icon-only" src="{{'trash-outline' | svgIcon }}" />
                    </ion-item-option>
                    <ion-item-option color="light" (click)="changeMembershipCategory(slidingItem, membership)">
                      <ion-icon slot="icon-only" src="{{'reload-outline' | svgIcon }}" />
                    </ion-item-option>
                    <ion-item-option color="primary" (click)="editMembership(slidingItem, membership)">
                      <ion-icon slot="icon-only" src="{{'create-outline' | svgIcon }}" />
                    </ion-item-option>
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
  `,
})
export class BkMembershipsAccordionComponent {
  protected modalController = inject(ModalController);
  public dataService = inject(DataService);
  public membershipService = inject(MembershipService);
  public authorizationService = inject(AuthorizationService);
  private router = inject(Router);

  public subjectKey = input.required<string>();
  public color = input('primary');
  public title = input('@membership.plural');
  protected memberships$ = computed(() => this.membershipService.listMembershipsOfSubject(this.subjectKey()));

  public LT = ListType;

  protected async addMembership() {
    await this.membershipService.createNewMembership(this.subjectKey());
  }

  protected async editMembership(slidingItem: IonItemSliding, membership: RelationshipModel): Promise<void> {
    if (slidingItem) slidingItem.close();
    if (this.authorizationService.hasRole('memberAdmin')) {
      this.membershipService.editMembership(membership);
    }
  }

  protected async endMembership(slidingItem: IonItemSliding, membership: RelationshipModel): Promise<void> {
    if (slidingItem) slidingItem.close();
    this.membershipService.endMembership(membership);
  }

  public async editOrg(orgKey: string): Promise<void> {
    if (this.authorizationService.hasRole('memberAdmin')) {
      navigateByUrl(this.router, `/org/${orgKey}`);    
    }
  }

  protected async changeMembershipCategory(slidingItem: IonItemSliding, membership: RelationshipModel): Promise<void> {
    if (slidingItem) slidingItem.close();
    await this.membershipService.changeMembershipCategory(membership);
  }

}
