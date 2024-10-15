import { Component, OnInit, inject, input } from '@angular/core';
import { SectionType } from '@bk/categories';
import { die } from '@bk/util';
import { Observable, firstValueFrom } from 'rxjs';
import { SectionModel } from '@bk/models';
import { BkArticleSectionComponent } from './article/bk-article-section';
import { BkSwiperSectionComponent } from './swiper/bk-swiper-section';
import { BkPeopleListSectionComponent } from './people-list/bk-people-list-section';
import { BkGallerySectionComponent } from './gallery/bk-gallery-section';
import { SectionService } from './section.service';
import { AsyncPipe } from '@angular/common';
import { IonItem, IonLabel } from '@ionic/angular/standalone';
import { PrettyjsonPipe, TranslatePipe } from '@bk/pipes';
import { BkAlbumSectionComponent } from './album/bk-album-section';
import { BkMapSectionComponent } from './map/bk-map-section';
import { BkVideoSectionComponent } from './video/bk-video-section';
import { BkCalendarSectionComponent } from './calendar/bk-calendar-section';
import { BkModelSectionComponent } from './model/bk-model-section';
import { BkHeroSectionComponent } from './hero/bk-hero-section';
import { BkButtonSectionComponent } from './button/bk-button-section';
import { BkChangeConfirmationComponent } from '@bk/ui';
import { BkTableSectionComponent } from './table/bk-table-section';
import { BkListSectionComponent } from './list/bk-list-section';
import { BkIframeSectionComponent } from './iframe/bk-iframe-section';
import { AuthorizationService } from '@bk/base';
import { BkAccordionSectionComponent } from './accordion/bk-accordion-section';
import { ChatSectionComponent } from './chat/chat-section'; 

/**
 * A section is part of a page.
 * The section renders differently depending on the type property.
 * Use it like this: <bk-section sectionType="name of the sectionType"></bk-section>
 */
@Component({
  selector: 'bk-section',
  standalone: true,
  imports: [
    TranslatePipe, AsyncPipe, PrettyjsonPipe,
    BkArticleSectionComponent, BkSwiperSectionComponent, BkPeopleListSectionComponent, 
    BkGallerySectionComponent, BkAlbumSectionComponent, BkListSectionComponent,
    BkMapSectionComponent, BkVideoSectionComponent,
    BkCalendarSectionComponent, BkModelSectionComponent, BkHeroSectionComponent,
    BkButtonSectionComponent, BkChangeConfirmationComponent, BkTableSectionComponent,
    BkIframeSectionComponent, BkAccordionSectionComponent, ChatSectionComponent,
    IonLabel, IonItem
  ],
  template: `
    @if(section$ | async; as section) {
      @if(showChangeConfirmation && !readOnly()) {
          <bk-change-confirmation [showCancel]="true" (okClicked)="save()" (cancelClicked)="cancel()" />
      } 
      @if (authorizationService.hasRole(section.roleNeeded)) {
        @switch (section.category) {
          @case(ST.Album) {                                   <!-- 0: Album -->
            <bk-album-section [section]="section" />
          }
          @case(ST.Article) {                                 <!-- 1: Article -->
            <bk-article-section [section]="section" [readOnly]="readOnly()" (contentChange)="onContentChange($event)" />
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
            <bk-people-list-section [section]="section" [readOnly]="readOnly()" (contentChange)="onContentChange($event)" />
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
          <!-- 10: unused Section Types -->
          @case(ST.Calendar) {                                <!-- 11: Calendar --> 
            <bk-calendar-section [section]="section" />
          }
          @case(ST.Model) {                                   <!-- 12: Model -->
            <bk-model-section [section]="section" />
          }
          @case(ST.Button) {                                  <!-- 13: Button -->    
            <bk-button-section [section]="section" [readOnly]="readOnly()" (contentChange)="onContentChange($event)" />
          }
          @case(ST.Table) {                                   <!-- 14: Table -->
            <bk-table-section [section]="section" />
          }
          @case(ST.Iframe) {                                  <!-- 15: Iframe -->
            <bk-iframe-section [section]="section" />
          }
          @case(ST.Accordion) {                               <!-- 16: Accordion -->
            <bk-accordion-section [section]="section" [readOnly]="readOnly()" />      
          }
          @case(ST.Chat) {                                    <!-- 17: Chat -->
            <bk-chat-section [section]="section" />
          }
          @default {
            <ion-label>{{ '@content.section.error.noSuchSection' | translate: { type: section.category } | async }}</ion-label>
          }
        }
        @if (authorizationService.currentUser()?.showDebugInfo === true) {
          <ion-item lines="none">
            <small><div [innerHTML]="section | prettyjson"></div></small>
          </ion-item>
        }
      }
    }
  `
})
export class BkSectionComponent implements OnInit {
  private readonly sectionService = inject(SectionService);
  public authorizationService = inject(AuthorizationService);

  public sectionKey = input.required<string>();
  public readOnly = input(false);

  public section$: Observable<SectionModel | undefined> | undefined;
  public ST = SectionType;
  protected showChangeConfirmation = false;
  private newContent = '';

  async ngOnInit() {
    this.section$ =  this.sectionService.readSection(this.sectionKey());
  }

  protected onContentChange(newContent: string): void {
    this.newContent = newContent;
    this.showChangeConfirmation = true;
  }

  protected async save(): Promise<void> {
    this.showChangeConfirmation = false;
    if (this.section$) {
      const _section = await firstValueFrom(this.section$);
      if (_section) {
        _section.content = this.newContent;
        console.log('BkSectionComponent.save(): updating section ' + _section.bkey + ' with new content: ' + _section.content);
        //this.sectionService.updateSection(_section);    
      } else {
        die(`BkSectionComponent.save(): section is undefined.`);
      }
    } else {
      die(`BkSectionComponent.save(): section$ is undefined.`);
    }
  }

  protected cancel(): void {
    this.newContent = '';
    this.showChangeConfirmation = false;
  }
}
