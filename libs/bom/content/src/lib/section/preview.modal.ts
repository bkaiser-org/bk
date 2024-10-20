import { Component, forwardRef, inject, input } from '@angular/core';
import { SectionType } from '@bk/categories';
import { SectionModel } from '@bk/models';
import { ArticleSectionComponent } from './article/article-section';
import { SwiperSectionComponent } from './swiper/bk-swiper-section';
import { IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonLabel, IonMenuButton, IonTitle, IonToolbar, ModalController } from '@ionic/angular/standalone';
import { GallerySectionComponent } from './gallery/bk-gallery-section';
import { PeopleListSectionComponent } from './people-list/bk-people-list-section';
import { AsyncPipe } from '@angular/common';
import { SvgIconPipe, TranslatePipe } from '@bk/pipes';
import { AlbumSectionComponent } from './album/bk-album-section';
import { ModelSectionComponent } from './model/bk-model-section';
import { MapSectionComponent } from './map/bk-map-section';
import { VideoSectionComponent } from './video/bk-video-section';
import { CalendarSectionComponent } from './calendar/bk-calendar-section';
import { HeroSectionComponent } from './hero/bk-hero-section';
import { ButtonSectionComponent } from './button/button-section';
import { IframeSectionComponent } from './iframe/bk-iframe-section';
import { ListSectionComponent } from './list/bk-list-section';
import { TableSectionComponent } from './table/bk-table-section';
import { AccordionSectionComponent } from './accordion/bk-accordion-section';

@Component( {
  selector: 'bk-preview-modal',
  standalone: true,
  imports: [
    TranslatePipe, AsyncPipe, SvgIconPipe,
    ArticleSectionComponent, SwiperSectionComponent, GallerySectionComponent, 
    forwardRef(() => PeopleListSectionComponent),
    AlbumSectionComponent, ModelSectionComponent, MapSectionComponent, VideoSectionComponent, 
    CalendarSectionComponent, HeroSectionComponent, ButtonSectionComponent, IframeSectionComponent,
    ListSectionComponent, TableSectionComponent, AccordionSectionComponent,
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
            <ion-icon slot="icon-only" src="{{'close-outline' | svgIcon }}" />
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

  public close(): void {
    this.modalController.dismiss(null, 'cancel');
  }
}
