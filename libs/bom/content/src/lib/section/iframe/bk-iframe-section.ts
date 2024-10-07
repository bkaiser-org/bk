import { Component, computed, inject, input } from '@angular/core';
import { SectionModel } from '@bk/models';
import { IonCard, IonCardContent } from '@ionic/angular/standalone';
import { BkSpinnerComponent } from '@bk/ui';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'bk-iframe-section',
  standalone: true,
  imports: [
    BkSpinnerComponent,
    IonCard, IonCardContent
  ],
  styles: [`
    ion-card-content { padding: 0px; }
    ion-card { padding: 0px; margin: 0px; border: 0px; box-shadow: none !important;}
  `],
  template: `
    @if(section(); as section) {
      <ion-card>
        <ion-card-content>
          <iframe [src]="url()" [style]="style()" [title]="title()" allow="autoplay;fullscreen" allowfullscreen frameborder="0"></iframe>
        </ion-card-content>
      </ion-card>

    } @else {
      <bk-spinner />
    }
  `
})
export class BkIframeSectionComponent {
  private sanitizer = inject(DomSanitizer);
  public section = input<SectionModel>();
  public style = computed(() => this.section()?.properties?.iframe?.style ?? 'width:100%; min-height:400px; border:none;');
  public title = computed(() => this.section()?.properties?.iframe?.title ?? '');

  protected url = computed(() => this.sanitizer.bypassSecurityTrustResourceUrl(this.section()?.url ?? ''));
}

