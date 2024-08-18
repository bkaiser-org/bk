import { Component } from '@angular/core';
import { IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCol, IonContent, IonGrid, IonRow } from '@ionic/angular/standalone';
import { BkHeaderComponent } from '@bk/ui';
import { ConfigService } from '@bk/util';
import { inject } from '@angular/core';

/*
  tbd: find a solution to dynamically load the language specific template based on the user's browser language.
*/
@Component({
  selector: 'bk-privacy',
  standalone: true,
  imports: [
    BkHeaderComponent, 
    IonContent, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonGrid, IonRow, IonCol
  ],
  template: `
  <bk-header title="Datenschutzerkl&auml;rung" />
<ion-content>
    <ion-card>
        <ion-card-header>
            <ion-card-title>1) Einleitung und allgemeine Angaben</ion-card-title>
        </ion-card-header>
        <ion-card-content>
            Vielen Dank f&uuml;r dein Interesse an unserer Website. Die vorliegende Datenschutzerkl&auml;rung 
            betrifft die auf der Domain <a href="https://{{ appDomain }}">{{ appDomain }}</a> laufende Web-Applikation 
            namens {{appName}} (fortan als 'Applikation' bezeichnet). Es handelt sich um eine Progressive Web Application (PWA), 
            dh. der gleiche Source Code wird als Applikation für iOS, Android und macOS gebaut.<br />
            Der Schutz deiner personenbezogenen Daten ist uns ein sehr wichtiges Anliegen.<br />
            Im Folgenden findest du Informationen zum Umgang mit deinen Daten, die durch deine Nutzung unserer Website erfasst werden.
            Die Verarbeitung deiner Daten erfolgt entsprechend den gesetzlichen Regelungen zum Datenschutz 
            (Bundesgesetz über den Datenschutz (E-DSG, Entwurf in Ratifizierung), EU-Datenschutz-Grundverordnung 
            (EU-DSGVO) vom Mai 2018, EU ePrivacy Richtlinie von 2009).
        </ion-card-content>
    </ion-card>
    <ion-card>
        <ion-card-header>
            <ion-card-title>2) Begriffe</ion-card-title>
        </ion-card-header>
        <ion-card-content>
                    Unsere Datenschutzerkl&auml;rung soll f&uuml;r jedermann einfach und verst&auml;ndlich sein. In unserer Datenschutzerkl&auml;rung
                    werden in der Regel die offiziellen Begriffe der Datenschutzgrundverordnung (<a href="https://eur-lex.europa.eu/legal-content/EN/TXT/?qid=1532348683434&uri=CELEX:02016R0679-20160504">DSGVO</a>) verwendet. Die offiziellen
                    Begriffsbestimmungen werden in Art. 4 DSGVO erl&auml;utert.        
            <ion-grid>
                <ion-row>
                    <ion-col size="3"><strong>Begriff</strong></ion-col>
                    <ion-col size="9"><strong>Erkl&auml;rung</strong></ion-col>
                </ion-row>
                <ion-row>
                    <ion-col size="3">Betreiber</ion-col>
                    <ion-col size="9">Betreiber der Website, in diesem Fall {{ operatorName }}.</ion-col>
                </ion-row>
                <ion-row>
                    <ion-col size="3">Nutzer</ion-col>
                    <ion-col size="9">Nutzer der Website oder derer Dienstleistungen, in diesem Fall bist du das.</ion-col>
                </ion-row>
                <ion-row>
                    <ion-col size="3">Personenbezogene Daten</ion-col>
                    <ion-col size="9">Informationen, mit deren Hilfe eine Person bestimmbar oder identifizierbar ist, also Angaben, die zur&uuml;ck 
                        zu einer Person verfolgt werden k&ouml;nnen. Dazu geh&ouml;rt der Name, die E-Mail-Adresse oder 
                        die Telefonnummer. Aber auch Daten &uuml;ber Vorlieben, Hobbys, Mitgliedschaften oder welche 
                        Webseiten von jemandem angesehen wurden z&auml;hlen zu personenbezogenen Daten.</ion-col>
                </ion-row>
                <ion-row>
                    <ion-col size="3"></ion-col>
                    <ion-col size="9"></ion-col>
                </ion-row>
            </ion-grid>
        </ion-card-content>
    </ion-card>
    <ion-card>
        <ion-card-header>
            <ion-card-title>3) Betreiber</ion-card-title>
        </ion-card-header>
        <ion-card-content>
            Betreiber der Website (nachfolgend Betreiber genannt) und damit Verantwortlicher/Datenbearbeiter 
            im Sinne der europäischen Datenschutz-Grundverordnung (DSGVO) un dem Schweizerischen Datenschutzgesetz (DSG) ist die:
            <ion-grid>
                <ion-row>
                    <ion-col size="4">Firmenname:</ion-col>
                    <ion-col>{{ operatorName }}</ion-col>
                </ion-row>
                <ion-row>
                    <ion-col size="4">Post-Adresse:</ion-col>
                    <ion-col>{{operatorStreet }}</ion-col>
                </ion-row>
                <ion-row>
                    <ion-col size="4"></ion-col>
                    <ion-col>{{operatorZip }} {{operatorCity }}</ion-col>
                </ion-row>
                <ion-row>
                    <ion-col size="4">E-Mail</ion-col>
                    <ion-col><a href="mailto:{{operatorEmail}}">{{operatorEmail }}</a></ion-col>
                </ion-row>
                <ion-row>
                    <ion-col size="4">Tel:</ion-col>
                    <ion-col>{{ operatorPhone }}</ion-col>
                </ion-row>
            </ion-grid>
        </ion-card-content>
    </ion-card>
    <ion-card>
        <ion-card-header>
            <ion-card-title>4) Datenschutzbeauftragter</ion-card-title>
        </ion-card-header>
        <ion-card-content>
            Der Datenschutzbeauftragte des Betreibers ist:<br />
            {{dpoName }}<br />
            {{operatorName }}<br />
            {{operatorStreet }}<br />
            {{operatorZip }} {{operatorCity }}<br />
            E-Mail: <a href="mailto:{{ dpoEmail }}">{{ dpoEmail }}</a>
        </ion-card-content>
    </ion-card>
    <ion-card>
        <ion-card-header>
            <ion-card-title>5) Allgemeine Hinweise zum Datenschutz</ion-card-title>
        </ion-card-header>
        <ion-card-content>
            Der Betreiber verarbeitet personenbezogene Daten seiner Nutzer grunds&auml;tzlich nur, soweit dies 
            zur Bereitstellung einer funktionsf&auml;higen Website sowie seiner Inhalte und Leistungen erforderlich ist. 
            Die Verarbeitung personenbezogener Daten erfolgt DSVGO konform nur aufgrund einer g&uuml;ltigen Rechtsgrundlage, 
            welche regelm&auml;ssig die Einwilligung des Nutzers ist. Eine Ausnahme gilt in solchen F&auml;llen, 
            in denen eine vorherige Einholung einer Einwilligung aus tats&auml;chlichen Gr&uuml;nden nicht m&ouml;glich ist 
            und die Verarbeitung durch gesetzliche Vorschriften gestattet ist.
        </ion-card-content>
    </ion-card>
    <ion-card>
        <ion-card-header>
            <ion-card-title>6) Datenverarbeitung durch den Besuch unserer Website</ion-card-title>
        </ion-card-header>
        <ion-card-content>
            Wenn du unsere Webseite aufrufst, ist es technisch notwendig, dass &uuml;ber deinen Internetbrowser Daten an
            unseren Webserver &uuml;bermittelt werden. Folgende Daten werden w&auml;hrend einer laufenden Verbindung zur
            Kommunikation zwischen deinem Internetbrowser und unserem Webserver aufgezeichnet:
            <ul class="dot-list">
                <li>Datum und Uhrzeit des Aufrufs</li>
                <li>Name der angeforderten Datei (Web Page, Bild etc.)</li>
                <li>Verwendeter Webbrowser und verwendetes Betriebssystem inkl. Version</li>
                <li>Referrer URL (die zuvor besuchte Seite)</li>
                <li>IP - Adresse des anfordernden Rechners</li>
                <li>Uebertragene Datenmenge</li>
            </ul>
            <strong>6.1) Zweck der Datenverarbeitung</strong><br />
            Die aufgelisteten Daten erheben wir, um einen reibungslosen Verbindungsaufbau der Website zu gew&auml;hrleisten
            und eine komfortable Nutzung unserer Website durch die Nutzer zu erm&ouml;glichen. Zudem dient die Logdatei der
            Auswertung der Systemsicherheit und -stabilit&auml;t sowie administrativen Zwecken. Rechtsgrundlage f&uuml;r die
            vor&uuml;bergehende Speicherung der Daten bzw. der Logfiles ist Art. 6 Abs. 1 lit. f DSGVO.<br /><br />
            <strong>6.2) Dauer der Speicherung</strong><br />
            Aus Gr&uuml;nden der technischen Sicherheit, insbesondere zur Abwehr von Angriffsversuchen auf unseren Webserver,
            werden diese Daten von uns kurzzeitig gespeichert. Anhand dieser Daten ist uns ein R&uuml;ckschluss auf einzelne
            Personen nicht m&ouml;glich. Nach sp&auml;testens 60 Tagen werden die Daten durch Verk&uuml;rzung der IP
            - Adresse auf Domainebene anonymisiert, sodass es nicht mehr m&ouml;glich ist, einen Bezug zum einzelnen Nutzer
            herzustellen.<br />
            In anonymisierter Form werden die Daten daneben ggf. zu statistischen Zwecken verarbeitet. Eine Speicherung
            dieser Daten zusammen mit anderen personenbezogenen Daten des Nutzers, ein Abgleich mit anderen
            Datenbest&auml;nden oder eine Weitergabe an Dritte findet zu keinem Zeitpunkt statt.
        </ion-card-content>
    </ion-card>
    <ion-card>
        <ion-card-header>
            <ion-card-title>7) Datenverarbeitung aus Kontaktformular und Kontaktaufnahme per E-Mail</ion-card-title>
        </ion-card-header>
        <ion-card-content>
            Wenn du uns per Kontaktformular oder E-Mail Anfragen persönliche Informationen schickst, werden deine Angaben 
            (z.B. Vor- und Nachname, Anrede, Postanschrift) zwecks Bearbeitung der
            Anfrage und f&uuml;r den Fall von Anschlussfragen bei uns gespeichert. Die Angabe einer E-Mail -
            Adresse ist zur Kontaktangabe erforderlich, die Angabe deines Namens sowie deiner Telefonnummer
            ist freiwillig. Diese Daten geben wir in keinem Fall an externe Parteien
            weiter. Rechtsgrundlage für die Verarbeitung der Daten ist unser berechtigtes Interesse an der
            Beantwortung deines Anliegens gem&auml;ss Art. 6 Abs. 1 lit.f DSGVO sowie ggf.Art. 6 Abs. 1 lit.b
            DSGVO. Deine Daten werden nach
            abschließender Bearbeitung deiner Anfrage gel&ouml;scht, sofern keine gesetzlichen
            Aufbewahrungspflichten entgegenstehen. Du kannst im Falle von Art. 6 Abs. 1 lit.f DSGVO gegen
            die Verarbeitung deiner personenbezogenen Daten jederzeit Widerspruch einlegen.
        </ion-card-content>
    </ion-card>
    <ion-card>
        <ion-card-header>
            <ion-card-title>8) Datenverarbeitung bei registrierten Mitgliedern</ion-card-title>
        </ion-card-header>
        <ion-card-content>
            Für jedes Mitglied vom {{ appTenant }} wird ein Konto in der Applikation eingerichtet. Jedes Mitglied hat einen 
            per User-ID und Passwort gesicherten Zugriff auf seine Daten. Im Rahmen der Anmeldung und der Nutzung der
            Applikation speichert der Betreiber Daten der Anwender, welche diese selbst bei der Anmeldung oder der 
            Aenderung ihrer Profile angeben und Daten, welche durch administrative Mitarbeiter oder durch Vereinsaktivitäten
            (zB Logbuch) erfasst werden. Solche Daten werden in einer <a href="https://firebase.google.com">Firebase Firestore</a> 
            Datenbank für die Dauer der Mitgliedschaft gespeichert. Der Betreiber benutzt diese Daten zB f&uuml;r den 
            Versand von Informationen oder Jahresrechnungen. Die Daten werden nie an externe Parteien weiter gegeben, mit Ausnahme 
            von externen Datenverarbeitungsdiensten, die unten aufgef&uuml;hrt sind. Nur privilegierte Vereinsmitglieder 
            (Vorstandsmitglieder oder Spezialfunktionen) haben Zugriff auf den gesamten Datenbestand. Normale Mitglieder
            können nur ihre eigenen Profildaten &auml;ndern und einzelne Adressdaten von anderen Mitgliedern sehen, um diese 
            kontaktieren zu k&ouml;nnen. Diese Zugriffsrestriktionen werden durch die programmierte Autorisierung mit 
            Rollenkonzept vollzogen. Die Daten werden sowohl 'at-transport' als auch 
            'at-rest' verschlüsselt. Die Datenhaltung erfolgt auf DSGVO-kompatiblen Servern von Google in der Schweiz.<br/><br />
            <strong>8.1) Rechtsgrundlage f&uuml;r die Bearbeitung</strong><br />
            Mit der Registrierung bei der Applikation vereinbart der Nutzer mit dem Betreiber einen Vertrag, welcher 
            durch die Zustimmung des Nutzers im Rahmen der Anmeldung auch die vorliegende Datenschutzerkl&auml;rung umfasst. 
            Die Datenschutzerkl&auml;rung ist jederzeit auch sp&auml;ter &uuml;ber das applikatorische Menu einsehbar.
            Rechtsgrundlage f&uuml;r die Verarbeitung der Daten sind damit Art. 6 Abs. 1 lit. b DSGVO und Art. 13 Abs. 2 lit. a DSG.<br />
            Der Betreiber verarbeitet die personenbezogenen Daten des Nutzers im Rahmen der Applikation gem&auml;ss den in den 
            Statuten definierten Vereinszwecken. Dies umfasst insbesondere die Speicherung der Daten f&uuml;r den Nutzer sowie die
            Sicherung in einem Backup. Die Daten k&ouml;nnen im Rahmen der Weiterentwicklung der Applikation f&uuml;r die Optimierung
            des Service verwendet werden.<br /><br />
            <strong>8.2) Dauer der Speicherung</strong><br />
            Die Daten werden gel&ouml;scht, sobald sie f&uuml;r die Erreichung des Zwecks ihrer Erhebung (also des Vereinszwecks)
            nicht mehr erforderlich sind, soweit die weitergehende Speicherung nicht durch &ueberwiegende Interessen oder
            gesetzliche Pflichten des Verantwortlichen gerechtfertigt werden. Dies bedeutet, dass die Mitglieder auf ihr Recht bzgl. 
            Datenl&ouml;schung w&auml;hrend der Dauer ihrer Mitgliedschaft verzichten. Nach dem Vereinsaustritt kann jedermann 
            jederzeit vom Datenschutzbeauftragten verlangen, dass die eigenen Daten vollst&auml;ndig gel&ouml;scht werden. 
            In diesem Fall werden die Profildaten und alle die Person betreffenden Dateien gel&ouml;scht. Entsprechende Eintr&auml;ge
            im Aktivit&auml;tslog und in den Backups k&ouml;nnen nicht gel&ouml;scht werden. Sie enthalten aber nur kondensierte Daten.
        </ion-card-content>
    </ion-card>
    <ion-card>
        <ion-card-header>
            <ion-card-title>9) Datenbearbeitung durch Google Analytics</ion-card-title>
        </ion-card-header>
        <ion-card-content>
            Unsere Website benutzt Google Analytics, einen Webanalysedienst der Google Ireland Limited, Gordon House,
            Barrow Street, Dublin 4, Ireland. („Google“).Google Analytics verwendet sogenannte Cookies. Das sind
            Textdateien, die auf deinem Computer gespeichert werden und die eine Analyse der Benutzung der Website 
            erm&ouml;glichen. Die durch das Cookie erzeugten Informationen &uuml;ber deine Benutzung dieser Website werden in
            der Regel an einen Server von Google in den USA &uuml;bertragen und dort gespeichert. Wir setzen Google Analytics
            nur mit aktivierter IP-Anonymisierung ein. Das bedeutet, die IP-Adresse der Nutzer wird von Google
            innerhalb von Mitgliedstaaten der Europ&auml;ischen Union oder in anderen Vertragsstaaten des Abkommens &uuml;ber den
            Europ&auml;ischen Wirtschaftsraum gek&uuml;rzt, wodurch eine Personenbeziehbarkeit ausgeschlossen werden kann. Google
            Inc. mit Sitz in den USA ist f&uuml;r das US - europ&auml;ische Datenschutz&uuml;bereinkommen „Privacy Shield“ zertifiziert,
            welches die Einhaltung des in der EU geltenden Datenschutzniveaus gew&auml;hrleistet.<br />
            Soweit du hierzu deine Einwilligung nach Art. 6 Abs. 1 S. 1 lit. a DSGVO erteilt hast, erfolgt die
                    Verarbeitung auf dieser Website zum Zweck der Webseitenanalyse.<br />
                    Im Auftrag des Betreibers dieser Website wird Google diese Informationen benutzen, um deine Nutzung
                    der Website auszuwerten, um Reports über die Websiteaktivit&auml;ten zusammenzustellen und um weitere mit
                    der Websitenutzung und der Internetnutzung verbundene Dienstleistungen gegen&uuml;ber dem
                    Websitebetreiber zu erbringen. Die im Rahmen von Google Analytics von deinem Browser &uuml;bermittelte IP -
                    Adresse wird nicht mit anderen Daten von Google zusammengef&uuml;hrt.Die Nutzungsbedingungen von Google
                    Analytics und Informationen zum Datenschutz kannst du &uuml;ber die folgenden Links abrufen:
                    http://www.google.com/analytics/terms/de.html sowie unter https://www.google.de/intl/de/policies/.<br /><br />
                    <strong>9.1) Deaktivierung von Google Analytics</strong>
                    Du kannst die Speicherung der Cookies durch eine entsprechende Einstellung deiner Browser-Software
                    verhindern; wir weisen jedoch darauf hin, dass du in diesem Fall gegebenenfalls nicht alle
                    Funktionen dieser Website vollumf&auml;nglich nutzen kannst. Du kannst dar&uuml;ber hinaus die Erfassung der
                    durch das Cookie erzeugten und auf deine Nutzung der Website bezogenen Daten (inkl. deiner IP-Adresse)
                    an Google sowie die Verarbeitung dieser Daten durch Google verhindern, indem du das unter der URL
                    https://tools.google.com/dlpage/gaoptout?hl=de verf&uuml;gbare Browser-Plug-in installierst oder eine andere
                    Cookie-Blocker Software.<br />
                    Informationen zum Umgang mit Nutzerdaten bei Google
                    Analytics findest du in der <a href="https://support.google.com/analytics/answer/6004245?hl=de" rel="nofollow"
                            target="_blank">Datenschutzerkl&auml;rung</a> von Google.
        </ion-card-content>
    </ion-card>
    <ion-card>
        <ion-card-header>
            <ion-card-title>10) Google Maps</ion-card-title>
        </ion-card-header>
        <ion-card-content>
            Unsere Homepage nutzt &uuml;ber eine Schnittstelle den Online-Kartendienstanbieter Google Maps. Anbieter des
            Kartendienstes ist Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Ireland. Zur Nutzung der
            Funktionalit&auml;ten von Google Maps ist es notwendig, deine IP Adresse zu speichern. Diese Informationen werden
            an einen Server von Google in den USA übertragen und dort gespeichert. Der Anbieter dieser Seite hat keinen
            Einfluss auf diese Daten&uuml;bertragung. Die Nutzung des Kartendienstes Google Maps erfolgt im Interesse einer
            ansprechenden Darstellung unseres Online-Angebots (zB. Logbuch) und an der einfacheren Auffindbarkeit der von uns auf der
            Website angef&uuml;hrten Adressen. Dies stellt ein berechtigtes Interesse im Sinne von Art. 6 Abs. 1 lit. f DSGVO
            dar. Weitere Informationen zum Umgang mit Nutzerdaten findest du in der Datenschutzerkl&auml;rung von Google: 
            <a href="https://www.google.de/intl/de/policies/privacy/" rel="nofollow"
                target="_blank">https://www.google.de/intl/de/policies/privacy/</a>.<br />
                Opt-out: <a href="https://www.google.com/settings/ads/" rel="nofollow"
                target="_blank">https://www.google.com/settings/ads/</a>
        </ion-card-content>
    </ion-card>
    <ion-card>
        <ion-card-header>
            <ion-card-title>11) Weitere Cookies</ion-card-title>
        </ion-card-header>
        <ion-card-content>
            Unsere Website setzt Cookies ein, die vom Browser auf Ihrem Gerät gespeichert werden und die bestimmte
            Einstellungen zur Nutzung der Website enthalten (z.B. zur laufenden Sitzung). Cookies dienen dazu, unser
            Angebot nutzerfreundlicher, effektiver und sicherer zu machen. Cookies sind kleine Textdateien, die auf
            deinem Rechner abgelegt werden und die Ihr Browser speichert. Die meisten der von uns verwendeten Cookies
            sind so genannte Session-Cookies, welche nach dem Schließen des Browsers automatisch gelöscht werden. Andere
            Cookies bleiben auf deinem Endger&auml;t gespeichert, bis du diese l&ouml;schst oder die Speicherdauer abl&auml;uft. Diese
            Cookies erm&ouml;glichen es uns, deinen Browser beim n&auml;chsten Besuch wiederzuerkennen.<br />
            Teilweise dienen die Cookies dazu, durch Speicherung von Einstellungen Websiteprozesse zu vereinfachen
                (z. B. das Vorhalten bereits ausgew&auml;hlter Optionen) oder zur Verbesserung der Performance mittels 
                einer tempor&auml;ren, lokalen Speicherung (Caching). Sofern durch einzelne von uns implementierte
                Cookies auch personenbezogene Daten verarbeitet werden, erfolgt die Verarbeitung gem&auml;ss Art. 6 Abs. 1
                lit. b DSGVO entweder zur Durchf&uuml;hrung des Vertrages oder gem&auml;ss Art. 6 Abs. 1 lit. f DSGVO zur Wahrung
                unserer berechtigten Interessen an der bestm&ouml;glichen Funktionalit&auml;t der Website sowie einer
                kundenfreundlichen und effektiven Ausgestaltung des Seitenbesuchs.<br />
                Du kannst deinen Browser so einstellen, dass du &uuml;ber das Setzen von Cookies informiert wirst und
                kannst Cookies so nur im Einzelfall erlauben, die Annahme von Cookies f&uuml;r bestimmte F&auml;lle oder generell
                ausschliessen sowie das automatische L&ouml;schen der Cookies beim Schliessen des Browsers aktivieren. Die
                Cookie Einstellungen k&ouml;nnen unter den folgenden Links f&uuml;r die jeweiligen Browser verwaltet werden.
            <ul class="dot-list">
                <li><a href="https:/ / support.mozilla.org / de / kb / cookies - erlauben - und - ablehnen" target="_blank" rel="nofollow">Firefox</a></li>
                <li><a href="http://support.google.com/chrome/bin/answer.py?hl=de&hlrm=en&answer=95647" target="_blank" rel="nofollow">Chrome</a></li>
                <li><a href="https://support.apple.com/kb/ph21411?locale=de_DE" target="_blank" rel="nofollow">Safari</a></li>
                <li><a href="https://help.opera.com/en/latest/web-preferences/#cookies" target="_blank" rel="nofollow">Opera</a></li>
            </ul>
            <p>
                Du kannst auch die Cookies vieler Unternehmen und Funktionen einzeln verwalten, die f&uuml;r Werbung
                eingesetzt werden. Verwende dazu einen Ad-Blocker, abrufbar unter 
                <a href="https://www.aboutads.info/choices/" rel="nofollow" target="_blank">aboutads.info</a> oder 
                <a href="http://www.youronlinechoices.com/uk/your-ad-choices" rel="nofollow" target="_blank">youronlinechoices.com</a>.
                Die meisten Browser bieten
                zudem eine sog. Do-Not-Track- oder Privacy-Funktion an, mit der du angeben kannst, dass du nicht von Websites
                verfolgt werden willst. Wenn diese Funktion aktiviert ist, teilt der jeweilige Browser
                Werbenetzwerken, Websites und Anwendungen mit, dass du nicht zwecks verhaltensbasierter Werbung und
                Aehnlichem verfolgt werden m&ouml;chtest. Informationen und Anleitungen, wie du diese Funktion bearbeiten
                kannst, erh&auml;st du je nach Anbieter deines Browsers, unter den nachfolgenden Links:
            </p>
            <ul class="dot-list">
                <li><a href="https://support.google.com/chrome/answer/2790761?co=GENIE.Platform%3DDesktop&hl=de" target="_blank" rel="nofollow">Google Chrome</a></li>
                <li><a href="https://www.mozilla.org/de/firefox/dnt/" target="_blank" rel="nofollow">Mozilla Firefox</a></li>
                <li><a href="http://help.opera.com/Windows/12.10/de/notrack.html" target="_blank" rel="nofollow">Opera</a></li>
                <li><a href="https://support.apple.com/kb/PH21416?locale=de_DE" target="_blank" rel="nofollow">Safari</a></li>
            </ul>
            <p>
                Zusätzlich kannst du standardm&auml;ssig das Laden sog. Scripts verhindern. NoScript erlaubt das Ausf&uuml;hren
                von JavaScripts, Java und anderen Plug-ins nur bei vertrauensw&uuml;rdigen Domains deiner Wahl. Informationen
                und Anleitungen, wie du diese Funktion bearbeiten kannst, erh&auml;st du &uuml;ber den Anbieter deines Browsers.
                Bitte sei dir bewusst, dass Cookies und Scripts wesentlich sind f&uuml;r die Funktionalit&auml;t dieser Website.
                Wenn du sie ausstellst, wird die Applikation nicht korrekt funktionieren.
            </p>
        </ion-card-content>
    </ion-card>
    <ion-card>
        <ion-card-header>
            <ion-card-title>12) Datenweitergabe und Empf&auml;nger</ion-card-title>
        </ion-card-header>
        <ion-card-content>
            <p>
                Eine Uebermittlung deiner personenbezogenen Daten an Dritte findet nicht statt, außer
            </p>
            <ul class="dot-list">
                <li>wenn wir in der Beschreibung der jeweiligen Datenverarbeitung explizit darauf hingewiesen haben.
                </li>
                <li>wenn du deine ausdr&uuml;ckliche Einwilligung nach Art. 6 Abs. 1 S. 1 lit. a DSGVO dazu erteilt hast,</li>
                <li>die Weitergabe nach Art. 6 Abs. 1 S. 1 lit. f DSGVO zur Geltendmachung, Aus&uuml;bung oder Verteidigung
                    von Rechtsanspr&uuml;chen erforderlich ist und kein Grund zur Annahme besteht, dass du ein überwiegendes
                    schutzw&uuml;rdiges Interesse an der Nichtweitergabe deiner Daten hast,</li>
                <li>im Falle, dass f&uuml;r die Weitergabe nach Art. 6 Abs. 1 S. 1 lit. c DSGVO eine gesetzliche
                    Verpflichtung besteht und</li>
                <li>soweit dies nach Art. 6 Abs. 1 S. 1 lit. b DSGVO f&uuml;r die Abwicklung von Vertragsverh&auml;ltnissen mit
                    dir erforderlich ist.
                </li>
            </ul>
            <p>
                Wir nutzen dar&uuml;ber hinaus f&uuml;r die Abwicklung unserer Services externe Dienstleister, die wir sorgf&auml;ltig
                ausgew&auml;hlt und schriftlich beauftragt haben. Sie sind an unsere Weisungen gebunden und werden von uns
                regelm&auml;ssig kontrolliert. Diese Dienstleister sind zust&auml;ndig f&uuml;r das Webhosting, den Versand von E-Mails sowie
                Wartung und Pflege unserer IT-Systemen usw. Diesen Dienstleistern ist es vertraglich untersagt, deine Daten an Dritte
                weiterzugeben.
            </p>

        </ion-card-content>
    </ion-card>
    <ion-card>
        <ion-card-header>
            <ion-card-title>13) Datensicherheit</ion-card-title>
        </ion-card-header>
        <ion-card-content>
            Wir treffen nach Massgabe des Art. 32 DSGVO unter Ber&uuml;cksichtigung des Stands der Technik, der
            Implementierungskosten und der Art, des Umfangs, der Umst&auml;nde und der Zwecke der Verarbeitung sowie der
            unterschiedlichen Eintrittswahrscheinlichkeit und Schwere des Risikos für die Rechte und Freiheiten
            nat&uuml;rlicher Personen, geeignete technische und organisatorische Massnahmen, um ein dem Risiko angemessenes
            Schutzniveau zu gew&auml;hrleisten. Diese Webseite nutzt aus Gr&uuml;nden der Sicherheit und zum Schutz der
            Uebertragung vertraulicher Inhalte eine SSL-Verschlüsselung (at-transport) und speichert Daten und Dateien in 
            verschl&uuml;sselter Form.
        </ion-card-content>
    </ion-card>
    <ion-card>
        <ion-card-header>
            <ion-card-title>14) Dauer der Speicherung personenbezogener Daten</ion-card-title>
        </ion-card-header>
        <ion-card-content>
            Die Dauer der Speicherung von personenbezogenen Daten bemisst sich an den einschl&auml;gigen gesetzlichen
            Aufbewahrungsfristen (z. B. aus dem Handelsrecht und dem Steuerrecht). Nach Ablauf der jeweiligen Frist
            werden die entsprechenden Daten routinem&auml;ssig gel&ouml;scht. Sofern Daten zur Vertragserf&uuml;llung oder
            Vertragsanbahnung erforderlich sind oder unsererseits ein berechtigtes Interesse an der Weiterspeicherung
            besteht, werden die Daten gel&ouml;scht, wenn Sie zu diesen Zwecken nicht mehr erforderlich sind oder du von
            deinem Widerrufs- oder Widerspruchsrecht Gebrauch machst.
        </ion-card-content>
    </ion-card>
    <ion-card>
        <ion-card-header>
            <ion-card-title>15) Deine Rechte</ion-card-title>
        </ion-card-header>
        <ion-card-content>
            <p>
                Im Folgenden findest du Informationen dazu, welche Betroffenenrechte das geltende Datenschutzrecht dir
                gegenüber dem Verantwortlichen hinsichtlich der Verarbeitung deiner personenbezogenen Daten gew&auml;hrt:

            </p>
            <p>
                Das Recht, gem&auml;ss Art. 15 DSGVO Auskunft &uuml;ber deine von uns verarbeiteten personenbezogenen Daten zu
                verlangen. <br>Insbesondere kannst du Auskunft &uuml;ber die Verarbeitungszwecke, die Kategorie der
                personenbezogenen Daten, die Kategorien von Empf&auml;ngern, gegen&uuml;ber denen deine Daten offengelegt wurden
                oder werden, die geplante Speicherdauer, das Bestehen eines Rechts auf Berichtigung, L&ouml;schung,
                Einschr&auml;nkung der Verarbeitung oder Widerspruch, das Bestehen eines Beschwerderechts, die Herkunft deiner
                Daten, sofern diese nicht bei uns erhoben wurden, sowie &uuml;ber das Bestehen einer automatisierten
                Entscheidungsfindung einschließlich Profiling und ggf. aussagekr&auml;ftigen Informationen zu deren
                Einzelheiten verlangen.</p>
            <p>Das Recht, gem&auml;ss Art. 16 DSGVO unverz&uuml;glich die Berichtigung unrichtiger oder Vervollst&auml;ndigung deiner bei
                uns gespeicherten personenbezogenen Daten zu verlangen.
            </p>
            <p>
                Das Recht, gem&auml;ss Art. 17 DSGVO die Löschung Ihrer bei uns gespeicherten personenbezogenen Daten zu
                verlangen, soweit nicht die Verarbeitung zur Ausübung des Rechts auf freie Meinungsäußerung und
                Information, zur Erfüllung einer rechtlichen Verpflichtung, aus Gründen des öffentlichen Interesses oder
                zur Geltendmachung, Ausübung oder Verteidigung von Rechtsansprüchen erforderlich ist.</p>
            <p>Das Recht, gem&auml;ss Art. 18 DSGVO die Einschränkung der Verarbeitung Ihrer personenbezogenen Daten zu
                verlangen, soweit die Richtigkeit der Daten von Ihnen bestritten wird, die Verarbeitung unrechtmäßig
                ist, Sie aber deren Löschung ablehnen und wir die Daten nicht mehr benötigen, Sie jedoch diese zur
                Geltendmachung, Ausübung oder Verteidigung von Rechtsansprüchen benötigen oder Sie gem&auml;ss Art. 21 DSGVO
                Widerspruch gegen die Verarbeitung eingelegt haben.

            </p>
            <p>
                Das Recht, gem&auml;ss Art. 20 DSGVO Ihre personenbezogenen Daten, die Sie uns bereitgestellt haben, in einem
                strukturierten, gängigen und maschinenlesebaren Format zu erhalten oder die Übermittlung an einen
                anderen Verantwortlichen zu verlangen.
            </p>
            <p>
                Das Recht, sich gem&auml;ss Art. 77 DSGVO bei einer Aufsichtsbehörde zu beschweren. In der Regel können Sie
                sich hierfür an die Aufsichtsbehörde des Bundeslandes unseres oben angegebenen Sitzes oder ggf. die
                Ihres üblichen Aufenthaltsortes oder Arbeitsplatzes wenden.
            </p>
            <p>
                Recht auf Widerruf erteilter Einwilligungen gem&auml;ss Art. 7 Abs. 3 DSGVO: Du hast das Recht, eine einmal
                erteilte Einwilligung in die Verarbeitung von Daten jederzeit mit Wirkung für die Zukunft zu widerrufen.
                Im Falle des Widerrufs werden wir die betroffenen Daten unverz&uuml;glich l&ouml;schen, sofern eine weitere
                Verarbeitung nicht auf eine Rechtsgrundlage zur einwilligungslosen Verarbeitung gest&uuml;tzt werden kann.
                Durch den Widerruf der Einwilligung wird die Rechtm&auml;ssigkeit der aufgrund der Einwilligung bis zum
                Widerruf erfolgten Verarbeitung nicht ber&uuml;hrt.
            </p>

        </ion-card-content>
    </ion-card>
    <ion-card>
        <ion-card-header>
            <ion-card-title>16) Widerspruchsrecht</ion-card-title>
        </ion-card-header>
        <ion-card-content>
            Sofern deine personenbezogenen Daten von uns auf Grundlage von berechtigten Interessen gem&auml;ss Art. 6 Abs. 1 S.
            1 lit. f DSGVO verarbeitet werden, hast du gem&auml;ss Art. 21 DSGVO das Recht, Widerspruch gegen die
            Verarbeitung deiner personenbezogenen Daten einzulegen, soweit dies aus Gr&uuml;nden erfolgt, die sich aus deiner
            besonderen Situation ergeben. Soweit sich der Widerspruch gegen die Verarbeitung personenbezogener Daten zum
            Zwecke von Direktwerbung richtet, hast du ein generelles Widerspruchsrecht ohne das Erfordernis der Angabe
            einer besonderen Situation.
            M&ouml;chtest du von deinem Widerrufs - oder Widerspruchsrecht Gebrauch machen, gen&uuml;gt eine E - Mail an den 
            Datenschutzverantwortlichen.
        </ion-card-content>
    </ion-card>
    <ion-card>
        <ion-card-header>
            <ion-card-title>17) Externe Verlinkungen</ion-card-title>
        </ion-card-header>
        <ion-card-content>
            Soziale Netzwerke (Facebook, Twitter, Xing etc.) sind auf unserer Webseite lediglich als Link zu den
            entsprechenden Diensten eingebunden. Nach dem Anklicken des eingebundenen Text- oder Bild-Links wirst du auf
            die Seite des jeweiligen Anbieters weitergeleitet. Erst nach der Weiterleitung werden Nutzerinformationen an
            den jeweiligen Anbieter &uuml;bertragen. Informationen zum Umgang mit deinen personenbezogenen Daten bei Nutzung
            dieser Webseiten entnimmst du bitte den jeweiligen Datenschutzbestimmungen der von dir genutzten
            Anbieter.
        </ion-card-content>
    </ion-card>
    <ion-card>
        <ion-card-header>
            <ion-card-title>18) Aenderungsvorbehalt</ion-card-title>
        </ion-card-header>
        <ion-card-content>
            Wir behalten uns vor, diese Datenschutzerkl&auml;rung erforderlichenfalls unter Beachtung der geltenden
            Datenschutzvorschriften anzupassen bzw. zu aktualisieren. Auf diese Weise k&ouml;nnen wir sie den aktuellen
            rechtlichen Anforderungen anpassen und Aenderungen unserer Leistungen ber&uuml;cksichtigen, z.B. bei der
            Einf&uuml;hrung neuer Services. F&uuml;r deinen Besuch gilt die jeweils aktuellste Fassung.
            Diese Datenschutzerkl&auml;rung basiert auf Vorlagen von <a href="https://www.datenschutzexperte.de/">
                www.datenschutzexperte.de</a> und <a href="https://www.peax.ch">peax.ch</a>.<br />
            Stand dieser Version: {{ dpaVersion }}.
        </ion-card-content>
    </ion-card>
</ion-content>
  `
})
export class PrivacyPageComponent {
  private configService = inject(ConfigService);

  public appName = this.configService.getConfigString('app_name');
  public appDomain = this.configService.getConfigString('app_domain');
  public appTenant = this.configService.getConfigString('tenant_name');
  public operatorName = this.configService.getConfigString('operator_name');
  public operatorStreet = this.configService.getConfigString('operator_street');
  public operatorZip = this.configService.getConfigString('operator_zipcode');
  public operatorCity = this.configService.getConfigString('operator_city');
  public operatorEmail = this.configService.getConfigString('operator_email');
  // data protection officer
  public dpoName = this.configService.getConfigString('dpo_name');
  public dpoEmail = this.configService.getConfigString('dpo_email');

  // data protection agreement
  public dpaVersion = this.configService.getConfigString('dpa_version');
}
