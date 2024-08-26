import { Component, computed, inject, input } from '@angular/core';
import { OrgType, RelationshipType } from '@bk/categories';
import { AuthorizationService, DataService } from '@bk/base';
import { AvatarPipe, BkSpinnerComponent } from '@bk/ui';
import { DurationPipe, FullNamePipe, MemberCategoryPipe, TranslatePipe } from '@bk/pipes';
import { CollectionNames, NameDisplay, navigateByUrl } from '@bk/util';
import { BaseModel, RelationshipModel } from '@bk/models';
import { IonAccordion, IonAvatar, IonButton, IonButtons, IonIcon, IonImg, IonItem, IonItemOption, IonItemOptions, IonItemSliding, IonLabel, IonList } from '@ionic/angular/standalone';
import { Observable, of } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { MembershipService } from './membership.service';
import { Router } from '@angular/router';
import { addIcons } from "ionicons";
import { addCircleOutline, createOutline, trashOutline } from "ionicons/icons";

@Component({
    selector: 'bk-members',
    standalone: true,
    imports: [
      TranslatePipe, MemberCategoryPipe, FullNamePipe, AvatarPipe, DurationPipe, AsyncPipe,
      BkSpinnerComponent,
      IonAccordion, IonItem, IonLabel, IonButton, IonIcon, IonList, IonButtons,
      IonAvatar, IonImg, IonItemSliding, IonItemOptions, IonItemOption
    ],
    template: `
        <ion-accordion toggle-icon-slot="start" value="members">
            <ion-item slot="header" [color]="color()">
                <ion-label>{{ title() | translate | async }}</ion-label>
                @if(readOnly() === false && authorizationService.hasRole('memberAdmin')) {
                  <ion-button fill="outline" (click)="addMember()">
                      <ion-icon color="secondary" slot="icon-only" name="add-circle-outline" />
                  </ion-button>
                }
            </ion-item>
            <div slot="content">
              @if(memberships$() | async; as memberships) {
                <ion-list lines="none">
                  @if(memberships.length === 0) {
                    <ion-item>
                      <ion-label>{{ '@general.noData.memberships' | translate | async }}</ion-label>
                    </ion-item>
                  } @else {
                    @for(member of memberships; track member.bkey) {
                      <ion-item-sliding #slidingItem>
                        <ion-item (click)="editMember(member)">
                          <ion-avatar slot="start">
                            <ion-img [src]="'0.' + member.subjectKey | avatar | async" />
                          </ion-avatar>
                          <ion-label>{{ member.subjectName | fullName:member.subjectName2:ND.FirstLast }}</ion-label>
                          @if(member.category === RT.Membership && member.objectCategory === OT.Group) {
                            <ion-label>{{ member.properties.orgFunction }}</ion-label>
                          }
                          @if(member.category !== RT.Membership || member.objectCategory !== OT.Group) {
                            <ion-label>{{ member.subType | memberCategory:member.objectKey }} / {{ member.validFrom | duration:member.validTo }}</ion-label>
                          }
                        </ion-item>
                        @if(authorizationService.hasRole('memberAdmin')) {
                          <ion-item-options side="end">
                            <ion-item-option color="danger" (click)="endMembership(slidingItem, member)"><ion-icon slot="icon-only" name="trash-outline" /></ion-item-option>
                            <ion-item-option color="primary" (click)="editMembership(slidingItem, member)"><ion-icon slot="icon-only" name="create-outline" /></ion-item-option>
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
export class BkMembersComponent {
  public dataService = inject(DataService);
  public membershipService = inject(MembershipService);
  public authorizationService = inject(AuthorizationService);
  private router = inject(Router);

  public org = input.required<BaseModel>();   // parent is always an org
  public title = input('@member.plural');
  public color = input('primary');
  public readOnly = input(false);

  public memberships$ = computed(() => this.getMembers(this.org().bkey));

  public ND = NameDisplay;
  public OT = OrgType;
  public RT = RelationshipType;

  constructor() {
    addIcons({addCircleOutline, createOutline, trashOutline});
  }

  private getMembers(orgKey: string | undefined): Observable<RelationshipModel[]> {
    if (!orgKey) return of([]);
    return this.dataService.searchData(CollectionNames.Membership, [
      { key: 'isTest', operator: '==', value: false },
      { key: 'isArchived', operator: '==', value: false },
      { key: 'objectKey', operator: '==', value: orgKey }
    ]) as Observable<RelationshipModel[]>;    
  }

  public async addMember() {
    console.log('tbd: BkMembersComponent.addMember: adding a member to org: ', this.org);
  }

  public async editMember(member: RelationshipModel) {
    if (this.authorizationService.hasRole('memberAdmin')) {
      navigateByUrl(this.router, `/person/${member.subjectKey}`);    
    }
  }

  protected async editMembership(slidingItem: IonItemSliding, membership: RelationshipModel): Promise<void> {
    if (slidingItem) slidingItem.close();
    if (this.authorizationService.hasRole('memberAdmin')) {
      this.membershipService.editMembership(membership);
    }
  }

  public async endMembership(slidingItem: IonItemSliding, membership: RelationshipModel): Promise<void> {
    if (slidingItem) slidingItem.close();
    this.membershipService.endMembership(membership);
  }   
}
