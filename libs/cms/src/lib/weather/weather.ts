import { AsyncPipe, DecimalPipe } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { PrettyDatePipe, RoundFloatPipe, TranslatePipe, WeatherIconPipe } from '@bk/pipes';
import { BkHeaderComponent } from '@bk/ui';
import { convertOpenWeatherData, DateFormat, getTodayStr, getYear, MeteoData, OpenWeatherData } from '@bk/util';
import { IonBadge, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCol, IonContent, IonGrid, IonIcon, IonItem, IonLabel, IonRow } from '@ionic/angular/standalone';
import { addIcons } from "ionicons";
import { sunnyOutline, shuffleOutline, thermometerOutline, rainyOutline } from "ionicons/icons";

@Component({
    selector: 'bk-weather',
    standalone: true,
    imports: [
      HttpClientModule, 
      BkHeaderComponent, 
      TranslatePipe, PrettyDatePipe, RoundFloatPipe, WeatherIconPipe, DecimalPipe, AsyncPipe,
      IonContent, IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardTitle, IonCardContent,
      IonIcon, IonItem, IonBadge, IonLabel 
    ],
    templateUrl: 'weather.html',
    styleUrls: ['weather.scss']
})
export class WeatherPageComponent implements OnInit {
    private http = inject(HttpClient);
    public meteoData: MeteoData | undefined;
    public currentTime: string | undefined;
    public todayDate: string | undefined;

    constructor() {
      addIcons({sunnyOutline, shuffleOutline, thermometerOutline, rainyOutline});
    }
  
    ngOnInit() {
        this.getOpenWeatherData();
        this.currentTime = getTodayStr(DateFormat.Time);
        this.todayDate = getTodayStr(DateFormat.ViewDate);
    }

    public getUrl(column: number): string {
        return `https://www.tecson-data.ch/zurich/mythenquai/diagramme/dtemp_jahr.php?combilog=mythenquai&such_zeit=${getYear()}&spalte=${column}`;
    }

    private async getOpenWeatherData(): Promise<void> {
        const _url = 'https://us-central1-seeclub-7ef7a.cloudfunctions.net/getOpenWeatherData';
        this.http.request<OpenWeatherData>('GET', _url).subscribe(_weatherData => {
            console.log(_weatherData);
            this.meteoData = convertOpenWeatherData(_weatherData);
            console.log(this.meteoData);
        })
    }
}