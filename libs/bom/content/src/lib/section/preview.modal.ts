import { Component, forwardRef, inject, input } from '@angular/core';
import { SectionType } from '@bk/categories';
import { SectionModel } from '@bk/models';
import { BkArticleSectionComponent } from './bk-article-section';
import { BkSwiperSectionComponent } from './bk-swiper-section';
import { IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonLabel, IonMenuButton, IonTitle, IonToolbar, ModalController } from '@ionic/angular/standalone';
import { BkGallerySectionComponent } from './bk-gallery-section';
import { BkPeopleListSectionComponent } from './bk-people-list-section';
import { AsyncPipe } from '@angular/common';
import { TranslatePipe } from '@bk/pipes';
import { BkAlbumSectionComponent } from './bk-album-section';
import { BkModelSectionComponent } from './bk-model-section';
import { BkMapSectionComponent } from './bk-map-section';
import { BkVideoSectionComponent } from './bk-video-section';
import { BkCalendarSectionComponent } from './bk-calendar-section';
import { BkHeroSectionComponent } from './bk-hero-section';
import { BkButtonSectionComponent } from './bk-button-section';
import { BkIframeSectionComponent } from './bk-iframe-section';
import { BkListSectionComponent } from './bk-list-section';
import { BkTableSectionComponent } from './bk-table-section';
import { BkAccordionSectionComponent } from './bk-accordion-section';
import { addIcons } from "ionicons";
import { closeOutline } from "ionicons/icons";

@Component( {
  selector: 'bk-preview-modal',
  standalone: true,
  imports: [
    TranslatePipe, AsyncPipe,
    BkArticleSectionComponent, BkSwiperSectionComponent, BkGallerySectionComponent, 
    forwardRef(() => BkPeopleListSectionComponent),
    BkAlbumSectionComponent, BkModelSectionComponent, BkMapSectionComponent, BkVideoSectionComponent, 
    BkCalendarSectionComponent, BkHeroSectionComponent, BkButtonSectionComponent, BkIframeSectionComponent,
    BkListSectionComponent, BkTableSectionComponent, BkAccordionSectionComponent,
    IonHeader, IonButtons, IonToolbar, IonTitle, IonButton, IonIcon, IonMenuButton,
    IonContent, IonLabel
  ],
  template: `
    <ion-header>
      <ion-toolbar color="secondary">
        <ion-buttons slot="start"><ion-menu-button></ion-menu-button></ion-buttons>      
        <ion-title>{{ title() }}</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="close()">
            <ion-icon slot="icon-only" name="close-outline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      @if(section(); as section) {
        @switch (section.category) {
          @case(ST.Album) {                                   <!-- 0: Album -->
            <bk-album-section [section]="section" />
          }
          @case(ST.Article) {                                 <!-- 1: Article -->
            <bk-article-section [section]="section" [readOnly]="true"  />
          }
          <!-- not yet implemented -->                        <!-- 2: Chart -->        
          @case(ST.Gallery) {                                 <!-- 3: Gallery -->
            <bk-gallery-section [section]="section" />
          }
          @case(ST.Hero) {                                    <!-- 4: Hero -->
            <bk-hero-section [section]="section" />
          }
          @case(ST.Map) {                                     <!-- 5: Map -->
            <bk-map-section [section]="section" />
          }
          @case(ST.PeopleList) {                              <!-- 6: PeopleList -->
            <bk-people-list-section [section]="section" [readOnly]="true"  />
          }
          @case(ST.Slider) {                                  <!-- 7: Slider -->
            <bk-swiper-section [section]="section" />
          }
          @case(ST.List) {                                    <!-- 8: List -->
            <bk-list-section [section]="section" />           
          }
          @case(ST.Video) {                                   <!-- 9: Video -->
            <bk-video-section [section]="section" />
          }
                                                              <!-- 10: unused section -->     
          @case(ST.Calendar) {                                <!-- 11: Calendar -->
            <bk-calendar-section [section]="section" />
          }
          @case(ST.Model) {                                   <!-- 12: Model -->       
            <bk-model-section [section]="section" />
          }
          @case(ST.Button) {                                  <!-- 13: Button -->      
            <bk-button-section [section]="section" [readOnly]="true"  />    
          }
          @case(ST.Table) {                                   <!-- 14: Table -->
            <bk-table-section [section]="section" />          
          }
          @case(ST.Iframe) {
            <bk-iframe-section [section]="section" />         <!-- 15: Iframe -->
          }
          @case(ST.Accordion) {                               <!-- 16: Accordion -->
            <bk-accordion-section [section]="section" [readOnly]="true" />      
          }
          @default {
            <ion-label>{{ '@content.section.error.noSuchSection' | translate: { type: section.category } | async }}</ion-label>
          }
        }
      }
    </ion-content>
  `
} )
export class PreviewModalComponent {
  private modalController = inject(ModalController);
  public section = input.required<SectionModel>();
  public title = input('Preview');

  public ST = SectionType;

  constructor() {
    addIcons({closeOutline });
  }

  public close(): void {
    this.modalController.dismiss(null, 'cancel');
  }
}
