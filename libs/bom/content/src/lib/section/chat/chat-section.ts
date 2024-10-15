import { CUSTOM_ELEMENTS_SCHEMA, Component, OnInit, inject, input } from '@angular/core';
import { SectionModel } from '@bk/models';
import { IonCard, IonCardContent } from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { ChannelService, ChatClientService, StreamAutocompleteTextareaModule, StreamChatModule, StreamI18nService } from 'stream-chat-angular';
import { BkSpinnerComponent } from '@bk/ui';

@Component({
  selector: 'bk-chat-section',
  standalone: true,
  imports: [
    BkSpinnerComponent,
    TranslateModule,
    IonCard, IonCardContent,
    StreamChatModule, StreamAutocompleteTextareaModule,
  ],
  schemas: [ 
    CUSTOM_ELEMENTS_SCHEMA
  ],
  styles: [`
    ion-card-content { padding: 0px; }
    ion-card { padding: 0px; margin: 0px; border: 0px; box-shadow: none !important;}
    #root { height: 100%; display: flex}
    stream-channel-list { width: 30%; }
    stream-channel { width: 100%; }
    stream-thread { width: 45%; }
  `],
  template: `
    @if(section(); as section) {
      <ion-card>
        <ion-card-content>
        <div id="root">
          <stream-channel-list />
          <stream-channel>
            <stream-channel-header />
            <stream-message-list />
            <stream-notification-list />
            <stream-message-input />
            <stream-thread name="thread">
              <stream-message-list mode="thread" />
              <stream-message-input mode="thread" />
            </stream-thread>
          </stream-channel>
        </div>
        </ion-card-content>
      </ion-card>
    } @else {
      <bk-spinner />
    }
  `
})
export class ChatSectionComponent implements OnInit {
  private readonly chatService = inject(ChatClientService);
  private readonly channelService = inject(ChannelService);
  private readonly streamI18nService = inject(StreamI18nService);

  public section = input<SectionModel>();
  
  constructor() {
    this.streamI18nService.setTranslation();
  }
  
  async ngOnInit() {
    const apiKey = 'dz5f4d5kzrue';
    const userId = 'crimson-lab-3';
    const userToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiY3JpbXNvbi1sYWItMyIsImV4cCI6MTcyOTA0NzI5M30.NvCdxXKdjAwqdQohPDxkWsUPSUKkS95ClJ-5U56QvvE';
    await this.chatService.init(apiKey, userId, userToken);

    const channel = this.chatService.chatClient.channel('messaging', 'talking-about-angular', {
      // add as many custom fields as you'd like
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Angular_full_color_logo.svg/2048px-Angular_full_color_logo.svg.png',
      name: 'Talking about Angular'
    });
    
    await channel.create();
    this.channelService.init({
      type: 'messaging',
      id: { $eq: 'talking-about-angular' },
    });
  }
}
