import { Component, computed, inject, input } from '@angular/core';
import { SectionModel } from '@bk/models';
import { IonCard, IonCardContent } from '@ionic/angular/standalone';
import { DomSanitizer } from '@angular/platform-browser';
import { BkSpinnerComponent } from '@bk/ui';

/**
 * A section that displays a video using Google's youtube player.
 * See: https://developers.google.com/youtube/player_parameters 
 */
@Component({
  selector: 'bk-video-section',
  standalone: true,
  imports: [
    BkSpinnerComponent,
    IonCard, IonCardContent,
  ],
  styles: [`
  ion-card-content { padding: 0px; }
  ion-card { padding: 0px; margin: 0px; border: 0px; box-shadow: none !important;}
  iframe { aspect-ratio: 16/9; width: 100% !important;}
  `],
  template: `
    @if(section(); as section) {
      <ion-card>
        <ion-card-content>
          <iframe id="ytplayer" type="text/html" width="100%" height="auto" [src]="videoUrl()" frameborder="0"></iframe>
        </ion-card-content>
      </ion-card>
    } @else {
      <bk-spinner />
    }
  `
})
export class BkVideoSectionComponent {
  private sanitizer = inject(DomSanitizer);
  public section = input.required<SectionModel>();
  // autoplay=1 starts the video automatically
  protected videoUrl = computed(() => this.sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/' + this.section()?.url));
}