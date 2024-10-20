import { Component, OnInit, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { ModelType, getCollectionNameFromModelType, getModelSlug } from "@bk/categories";
import { DateFormat, NameDisplay, convertDateFormatToString, navigateByUrl } from "@bk/util";
import { BaseModel, SectionModel, isOrg, isPerson, isUser } from "@bk/models";
import { BkAvatarLabelComponent, BkSpinnerComponent } from "@bk/ui";
import { FullNamePipe, TranslatePipe } from "@bk/pipes";
import { IonButton, IonCard, IonCardContent, IonCol, IonGrid, IonItem, IonLabel, IonRow } from '@ionic/angular/standalone';
import { AsyncPipe } from '@angular/common';
import { DataService } from '@bk/base';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'bk-model-section',
  standalone: true,
  imports: [
    BkAvatarLabelComponent, BkSpinnerComponent,
    FullNamePipe, TranslatePipe, AsyncPipe,
    IonCard, IonCardContent, IonGrid, IonRow, IonCol, IonItem, IonButton, IonLabel
  ],
  styles: [`
    ion-card-content { padding: 0px; }
    ion-card { padding: 0px; margin: 0px; border: 0px; box-shadow: none !important;}
  `],
  template: `
    @if(section(); as section) {
      <ion-card>
        <ion-card-content>
          <ion-grid>
            <ion-row>
              @if(section.properties.modelInfo; as modelInfo) {
                @for(attribute of modelInfo.visibleAttributes; track attribute) {
                  <ion-col size="12">
                    @if(attribute === 'key') {
                      <ion-label (click)="showModel()">{{ model?.bkey }}</ion-label>
                    } @else {
                      <ion-label>{{ showAttribute(attribute) }}</ion-label>
                    }
                  </ion-col>
                }
              }
            </ion-row>
          </ion-grid>
        </ion-card-content>
      </ion-card>
    } @else {
      <bk-spinner />
    }
  `
})
export class ModelSectionComponent implements OnInit {
  private router = inject(Router);
  //private modalController = inject(ModalController);
  private dataService = inject(DataService);
  public section = input<SectionModel>();

  protected model: BaseModel | undefined;

  public ND = NameDisplay;
  public MT = ModelType;

  async ngOnInit(): Promise<void> {
    const _section = this.section();
      if (_section?.properties?.modelInfo) {
        const _modelInfo = _section.properties.modelInfo;
        this.model = await firstValueFrom(this.dataService.readModel(getCollectionNameFromModelType(_modelInfo.modelType), _modelInfo.bkey));
      }
  }

  protected showAttribute(attribute: string): string {
    // base attributes
    switch (attribute) {
      case 'key': return this.model?.bkey ?? '';
      case 'name': return this.model?.name ?? '';
    }
    switch(this.model?.modelType) {
      case ModelType.Person:
        if (isPerson(this.model)) {
          switch(attribute) {
            case 'firstName': return this.model.firstName;
            case 'fullName': return this.model.firstName + ' ' + this.model.name;
            case 'email': return this.model.fav_email;
            case 'phone': return this.model.fav_phone;
            case 'date': return convertDateFormatToString(this.model.dateOfBirth, DateFormat.StoreDate, DateFormat.ViewDate);
            case 'iban': return 'tbd: IBAN';
            case 'description': return this.model.description;
          }
        }
        break;
      case ModelType.User:
        if (isUser(this.model)) {
          switch(attribute) {
            case 'loginEmail': return this.model.loginEmail;
            case 'fullName': return this.model.personName;
          }
        }
        break;
      case ModelType.Org:
        if (isOrg(this.model)) {
          switch(attribute) {
            case 'name': return this.model.name;
            case 'email': return this.model.fav_email;
            case 'phone': return this.model.fav_phone;
            case 'date': return convertDateFormatToString(this.model.dateOfBirth, DateFormat.StoreDate, DateFormat.ViewDate);
            case 'iban': return 'tbd: IBAN';
            case 'description': return this.model.description;
          }
        }
        break;
      case ModelType.Boat:
      case ModelType.Resource:
      case ModelType.Group:
      case ModelType.Event:
      case ModelType.Address:
      case ModelType.Document:
      case ModelType.Locker:
      case ModelType.HouseKey:
      case ModelType.Location:
      case ModelType.Subject:
      case ModelType.Relnote:
      case ModelType.Comment:
      case ModelType.Relationship:
      case ModelType.Application:
      case ModelType.Page:
      case ModelType.Section:

    }
    return '';
  }

  public showModel(): void {
    if (this.model) {
      const _slug = getModelSlug(this.model.modelType)
      navigateByUrl(this.router, `/${_slug}/${this.model.bkey}`);
    }
  }
}
