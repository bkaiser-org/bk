import { IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCol, IonContent, IonGrid, IonRow } from '@ionic/angular/standalone';
import { BkHeaderComponent } from '@bk/ui';
import { TranslatePipe } from '@bk/pipes';
import { AsyncPipe } from '@angular/common';
import { ConfigService } from '@bk/util';
import { inject, OnInit, Component } from '@angular/core';

@Component({
  selector: 'bk-terms',
  standalone: true,
  imports: [
    TranslatePipe, AsyncPipe,
    BkHeaderComponent, 
    IonContent, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonGrid, IonRow, IonCol
  ],
  styles: `
    .license {
      background-color: #e8f7e7;
    }
  `,
  template: `
  <bk-header title="{{ '@cms.terms.title' | translate | async }}" />
  <ion-content>
    <ion-card>
        <ion-card-header>
            <ion-card-title>{{ '@cms.terms.content.title' | translate | async }}</ion-card-title>
        </ion-card-header>
        <ion-card-content>
            {{ operatorName }} pr&uuml;ft und aktualisiert die Informationen auf dieser Website regelm&auml;ssig. Trotz aller Sorgfalt
            &uuml;bernimmt {{operatorName}} keine Haftung oder Garantie f&uuml;r die Aktualit&auml;t, Richtigkeit, Vollst&auml;ndigkeit
            oder Qualit&auml;t der online verf&uuml;gbaren Informationen.<br />
            {{ operatorName }} haftet im Zusammenhang mit der Nutzung dieser Website und der Verwendung der zur Verf&uuml;gung gestellten
            Informationen und Daten ausschliesslich f&uuml;r von ihren leitenden Organen vors&auml;tzlich oder grobfahrl&auml;ssig 
            verursachte Sch&auml;den oder im Fall von zwingenden gesetzlichen Haftungsbestimmungen.<br />
            Dar&uuml;ber hinaus ist jegliche Haftung im Zusammenhang mit dieser Website, sowohl f&uuml;r direkte als auch f&uuml;r indirekte
            Sch&auml;den, einschliesslich entgangenem Gewinn und andere Folgesch&auml;den, ausgeschlossen. Dieser Haftungsausschluss gilt
            insbesondere auch f&uuml;r Sch&auml;den, welche aus dem Zugriff oder der Nutzung bzw. Nichtnutzung der ver&ouml;ffentlichten
            Informationen, durch Missbrauch der Verbindung oder durch technische St&ouml;rungen entstanden sind, sowie durch Viren oder andere
            sch&auml;dliche Programme oder auf andere Weise an der Computer-Ausr&uuml;stung oder den Programmen der Nutzer oder an deren
            Daten (einschliesslich Datenverlust) verursacht werden.<br />
            Alle Angebote sind freibleibend und unverbindlich. {{operatorName }} beh&auml;lt es sich ausdr&uuml;cklich vor, einzelne Seiten
            oder das gesamte Onlineangebot ohne vorhergehende Ank&uuml;ndigung zu ver&auml;ndern, zu erg&auml;nzen, zu l&ouml;schen oder das 
            Angebot auf bestimmte Zeit oder auch endg&uuml;ltig einzustellen.
        </ion-card-content>
    </ion-card>
    <ion-card>
        <ion-card-header>
            <ion-card-title>{{ '@cms.terms.links.title' | translate | async }}</ion-card-title>
        </ion-card-header>
        <ion-card-content><div [innerHtml]="'@cms.terms.links.description' | translate | async"></div></ion-card-content>
    </ion-card>
    <ion-card>
        <ion-card-header>
            <ion-card-title>{{ '@cms.terms.ipr.title' | translate | async }}</ion-card-title>
        </ion-card-header>
        <ion-card-content>
            <ion-grid>
                <ion-row>
                    <ion-col size="3"><strong>Objekt</strong></ion-col>
                    <ion-col><strong>Rechte</strong></ion-col>
                </ion-row>
                <ion-row>
                    <ion-col size="3">Logo</ion-col>
                    <ion-col>Das Logo von {{ appTenant }} geh&ouml;rt {{appTenant}}</ion-col>
                </ion-row>
                <ion-row>
                    <ion-col size="3">Quellcode</ion-col>
                    <ion-col>
                        Der Quellcode der Webapplikation liegt im Copyright der {{operatorName }} und wird als Open Source unter der
                        <a href="https://opensource.org/licenses/MIT">MIT Lizenz</a> frei gegeben. 
                    </ion-col>
                </ion-row>
                <ion-row>
                    <ion-col size="3"><img src="{{osiLogo}}" alt="OSI Logo" /></ion-col>
                    <ion-col class="license">
                        Copyright 2019 {{ operatorName }}<br />
                        Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation 
                        files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, 
                        copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons 
                        to whom the Software is furnished to do so, subject to the following conditions:<br />
                        The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.<br />
                        THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF 
                        MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE 
                        FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR 
                        IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
                    </ion-col>
                </ion-row>
                <ion-row>
                    <ion-col size="3"></ion-col>
                    <ion-col>
                        Der Quellcode wird auf <a href="https://github.com">Github</a>
                        archiviert im Repository <a href="https://github.com/{{appRepo}}">{{appRepo }}</a>. Bitte erfasse Fehler, Fragen oder Anforderungen direkt als 
                        <a href="{{ issueUrl }}">Issue</a> im Projekt.
                    </ion-col>
                </ion-row>
                <ion-row>
                    <ion-col size="3">
                        Inhalt<br />
                        <a rel="license" href="http://creativecommons.org/licenses/by/4.0/">
                            <img alt="Creative Commons Lizenzvertrag" style="border-width:0" src="https://i.creativecommons.org/l/by/4.0/88x31.png" />
                        </a>
                    </ion-col>
                    <ion-col>
                        Der Inhalt von <span xmlns:dct="http://purl.org/dc/terms/" property="dct:title">{{ appName }}</span>
                         (Texte, Bilder, Design, Daten, Informationen) wurde entweder durch 
                         <a xmlns:cc="http://creativecommons.org/ns#" href="https://{{operatorWeb}}" property="cc:attributionName" rel="cc:attributionURL">
                            {{operatorName }}</a> oder die 
                        Mitglieder des {{appTenant }} erfasst. Diesen Autoren gehört das un&uuml;bertragbare Copyright. Sie lizenzieren ihre Beitr&auml;ge
                        unter einer 
                        <a rel="license" href="http://creativecommons.org/licenses/by/4.0/">Creative Commons Namensnennung 4.0 International Lizenz</a>.
                    </ion-col>
                </ion-row>
            </ion-grid>
        </ion-card-content>
    </ion-card>
    <ion-card>
        <ion-card-header>
            <ion-card-title>Kinderschutz</ion-card-title>
        </ion-card-header>
        <ion-card-content>
            Rechtsvertreter von Benutzern unter 18 Jahren (Junioren und Juniorinnen) sind deren Eltern oder Erziehungsberechtigte.
            Personen unter 18 Jahren m&uuml;ssen deshalb vor Uebermittlung personenbezogener Daten an uns die Erlaubnis ihrer Eltern 
            oder Erziehungsberechtigten einholen. Dies erfolgt durch deren Unterschrift auf dem Aufnahme-Formular.
        </ion-card-content>
    </ion-card>
    <ion-card>
        <ion-card-header>
            <ion-card-title>Gerichtsstand und Rechtswahl</ion-card-title>
        </ion-card-header>
        <ion-card-content>
            Ausschliesslicher Gerichtsstand f&uuml;r allf&auml;llige Streitigkeiten im Zusammenhang mit dieser Website
            ist der Gesch&auml;ftssitz des Betreibers {{operatorName}}. Unter Ausschluss aller Gesetze und Regeln zum 
            internationalen Privatrecht gilt das Schweizer Recht.
        </ion-card-content>
    </ion-card>
    <ion-card>
        <ion-card-header>
            <ion-card-title>Kommentare und Bewertungen der Anwender</ion-card-title>
        </ion-card-header>
        <ion-card-content>
            Die Nutzungsbedingungen sind massgeblich f&uuml;r das Verhalten der Website Besucher/innen in Bezug auf
            die vom Betreiber {{operatorName }} angebotenen M&ouml;glichkeiten (Kommentare, Chat-Messages etc.).
            Wenn Inhalte jedweder Art an {{operatorName }} gesendet werden, sichern die Absender/innen Folgendes zu:
            <ul>
                <li>Sie sind alleinige Urheber und Eigent&uuml;mer der entsprechenden Rechte an geistigem Eigentum.</li>
                <li>Sie verzichten freiwillig auf alle immateriellen Rechte, die ihnen m&ouml;glicherweise in Bezug auf die Inhalte zustehen.</li>
                <li>Sie sind mindestens 18 Jahre alt.</li>
                <li>Die Nutzung der von ihnen bereitgestellten Inhalte stellt keinen Verstoss gegen irgendwelche Rechtsgrundlagen, 
                    Dokumente Dritter oder die Nutzungsbedingungen dar und f&uuml;hrt nicht zu Sch&auml;den für nat&uuml;rliche 
                    oder juristische Personen.</li>
                <li>Es sind keine Inhalte, die beleidigend, diffamierend und hasserf&uuml;llt sind oder sexistische, 
                    rassistische oder religi&ouml;se Vorurteile ausdr&uuml;cken oder solchermassen aufgefasst werden k&ouml;nnten.</li>
                <li>Es sind keine Inhalte, die Computer-Viren, Malware (sch&auml;dliche Software) oder andere potenziell 
                    gef&auml;hrlichen Computer-Programme oder Dateien enthalten.</li>
                <li>In Bezug auf die von Webseite Besucher/innen zur Verf&uuml;gung gestellten Inhalte wird {{ operatorName }} 
                    das unbefristete, unwiderrufliche, unentgeltliche, &uuml;bertragbare Recht zugeteilt.</li>
                <li>Die an {{operatorName }} &uuml;bermittelten Inhalte d&uuml;rfen nach deren eigenem Ermessen 
                    verwendet werden. {{operatorName }} beh&auml;lt sich das Recht vor, die Inhalte zu korrigieren oder zu l&ouml;schen, 
                    die in deren eigenen Ermessen einen Verstoss gegen die Richtlinien und sonstigen Bestimmungen der
                    vorliegenden Nutzungsbedingungen darstellen.</li>
            </ul>
        </ion-card-content>
    </ion-card>
</ion-content>
  `
})
export class TermsPageComponent implements OnInit {
  protected configService = inject(ConfigService);
  public operatorName = ''; 
  public operatorWeb = '';
  public appName = '';
  public appTenant = '';
  public appRepo = '';
  public issueUrl = '';
  public osiLogo = '';

  ngOnInit(): void {
    this.operatorName = this.configService.getConfigString('operator_name'); 
    this.operatorWeb = this.configService.getConfigString('operator_web');
    this.appName = this.configService.getConfigString('app_name');
    this.appTenant = this.configService.getConfigString('tenant_name');
    this.appRepo = this.configService.getConfigString('git_org') + '/' + this.configService.getConfigString('git_name');
    this.issueUrl = this.configService.getConfigString('git_issue_url');
    this.osiLogo = this.configService.getConfigString('cms_osilogo_url');
  }
}
