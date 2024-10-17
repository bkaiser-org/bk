import { Component, computed, model, output } from '@angular/core';
import { SectionProperties, Table, TableConfig } from '@bk/models';
import { BkStringsComponent, BkTextInputComponent, htmlTextMask } from '@bk/ui';
import { IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCol, IonGrid, IonLabel, IonRow } from '@ionic/angular/standalone';
import { TranslatePipe } from '@bk/pipes';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'bk-table-section-form',
  standalone: true,
  imports: [
    TranslatePipe, AsyncPipe,
    IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonLabel,
    BkStringsComponent, BkTextInputComponent
  ],
  template: `
    @if(table(); as table) {
      <ion-row>
        <ion-col size="12">
          <ion-card>
            <ion-card-header>
              <ion-card-title>Tabellen - Konfiguration</ion-card-title>
            </ion-card-header>
            <ion-card-content>
              <ion-grid>
                <ion-row>
                  <ion-col size="12" size-md="6">
                    <bk-text-input name="gridTemplate" [value]="config().gridTemplate" (changed)="onConfigChange('gridTemplate', $event)" [showHelper]="true" />
                  </ion-col>
                  <ion-col size="12" size-md="6">
                    <bk-text-input name="gridGap" [value]="config().gridGap" (changed)="onConfigChange('gridGap', $event)"  [showHelper]="true"/>
                  </ion-col>
                  <ion-col size="12" size-md="6">
                    <bk-text-input name="gridBackgroundColor" [value]="config().gridBackgroundColor" (changed)="onConfigChange('gridBackgroundColor', $event)"  [showHelper]="true"/>
                  </ion-col>
                  <ion-col size="12" size-md="6">
                    <bk-text-input name="gridPadding" [value]="config().gridPadding" (changed)="onConfigChange('gridPadding', $event)"  [showHelper]="true"/>
                  </ion-col>
                </ion-row>
              </ion-grid>
            </ion-card-content>
          </ion-card>
        </ion-col>
      </ion-row>
      <ion-row>
        <ion-col size="12">
          <ion-card>
            <ion-card-header>
              <ion-card-title>Header/Titel - Konfiguration</ion-card-title>
            </ion-card-header>
            <ion-card-content>
              <ion-grid>
                <ion-row>
                  <ion-col size="12" size-md="6">
                    <bk-text-input name="headerBackgroundColor" [value]="config().headerBackgroundColor" (changed)="onConfigChange('headerBackgroundColor', $event)"  [showHelper]="true"/>
                  </ion-col>
                  <ion-col size="12" size-md="6">
                    <bk-text-input name="headerTextAlign" [value]="config().headerTextAlign" (changed)="onConfigChange('headerTextAlign', $event)"  [showHelper]="true"/>
                  </ion-col>
                  <ion-col size="12" size-md="6">
                    <bk-text-input name="headerFontSize" [value]="config().headerFontSize" (changed)="onConfigChange('headerFontSize', $event)"  [showHelper]="true"/>
                  </ion-col>
                  <ion-col size="12" size-md="6">
                    <bk-text-input name="headerFontWeight" [value]="config().headerFontWeight" (changed)="onConfigChange('headerFontWeight', $event)"  [showHelper]="true"/>
                  </ion-col>
                  <ion-col size="12" size-md="6">
                    <bk-text-input name="headerPadding" [value]="config().headerPadding" (changed)="onConfigChange('headerPadding', $event)"  [showHelper]="true"/>
                  </ion-col>
                </ion-row>
              </ion-grid>
            </ion-card-content>
          </ion-card>
        </ion-col>
      </ion-row>
      <ion-row>
        <ion-col size="12">
          <ion-card>
            <ion-card-header>
              <ion-card-title>Felder - Konfiguration</ion-card-title>
            </ion-card-header>
            <ion-card-content>
              <ion-grid>
                <ion-row>
                  <ion-col size="12" size-md="6">
                    <bk-text-input name="cellBackgroundColor" [value]="config().cellBackgroundColor" (changed)="onConfigChange('cellBackgroundColor', $event)"  [showHelper]="true"/>
                  </ion-col>
                  <ion-col size="12" size-md="6">
                    <bk-text-input name="cellTextAlign" [value]="config().cellTextAlign" (changed)="onConfigChange('cellTextAlign', $event)"  [showHelper]="true"/>
                  </ion-col>
                  <ion-col size="12" size-md="6">
                    <bk-text-input name="cellFontSize" [value]="config().cellFontSize" (changed)="onConfigChange('cellFontSize', $event)"  [showHelper]="true"/>
                  </ion-col>
                  <ion-col size="12" size-md="6">
                    <bk-text-input name="cellFontWeight" [value]="config().cellFontWeight" (changed)="onConfigChange('cellFontWeight', $event)"  [showHelper]="true"/>
                  </ion-col>
                  <ion-col size="12" size-md="6">
                    <bk-text-input name="cellPadding" [value]="config().cellPadding" (changed)="onConfigChange('cellPadding', $event)"  [showHelper]="true"/>
                  </ion-col>
                </ion-row>
              </ion-grid>
            </ion-card-content>
          </ion-card>
        </ion-col>
      </ion-row>
      <ion-row>
        <ion-col size="12">
          <!-- header -->
          <bk-strings [strings]="header()!" [mask]="mask" [maxLength]="40" (stringsChanged)="onHeaderChange($event)" 
            title="Titel (Header)" 
            description="Optional kannst du hier die Inhalte der Titel-Zeile der Tabelle eintragen. Die Reihenfolge der Einträge entspricht der Reihenfolge der Zellen in der Tabelle. Die Einträge können nachträglich sortiert oder gelöscht werden. Die Titelzeile wird nur angezeigt, wenn sie Inhalte enthält."
            addLabel="Neuen Titel hinzufügen" />
        </ion-col>
      </ion-row>
      <ion-row>
        <ion-col size="12">
          <!-- content -->
          <bk-strings [strings]="content()!" [mask]="mask" [maxLength]="500" (stringsChanged)="onContentChange($event)" 
          title="Felder"
          description="Hier kannst du die Daten der Tabelle eintragen. Füge für jede Zelle der Tabelle ein eigenes Feld hinzu. Die Feld-Einträge bestehen aus html-Fragmenten. Es können also auch Links eingegeben werden. Umlaute sind als HTML-Codes einzugeben. Die Reihenfolge der Feld-Einträge entspricht der Reihenfolge der Zellen in der Tabelle. Die Felder können nachträglich sortiert oder gelöscht werden."
          addLabel="Neues Feld hinzufügen" />
        </ion-col>
      </ion-row>
    }
  `
})
export class BkTableSectionFormComponent {
  public table = model.required<Table>();
  protected config = computed(() => this.table().config) ?? this.getEmptyTableConfig();
  protected header = computed(() => this.table().header) ?? [];
  protected content = computed(() => this.table().content) ?? [];

  protected mask = htmlTextMask;

  public changedProperties = output<SectionProperties>();

  protected onConfigChange(configKey: keyof TableConfig, value: string): void {
    const _config = this.table().config;
    _config[configKey] = value;
    this.table.update((_table) => ({..._table, 'config': _config}));
    this.changedProperties.emit({ table: this.table()});
  }

  protected onHeaderChange(changedHeader: string[]): void {
    this.table.update((_table) => ({..._table, 'header': changedHeader}));
    this.changedProperties.emit({ table: this.table()});
  }

  protected onContentChange(changedContent: string[]): void {
    this.table.update((_table) => ({..._table, 'content': changedContent}));
    this.changedProperties.emit({ table: this.table()});
  }

  private getEmptyTableConfig(): TableConfig {
    return {
      gridTemplate: 'auto auto',
      gridGap: '1px',
      gridBackgroundColor: 'grey',
      gridPadding: '1px',
      headerBackgroundColor: 'lightgrey',
      headerTextAlign: 'center',
      headerFontSize: '1rem',
      headerFontWeight: 'bold',
      headerPadding: '5px',
      cellBackgroundColor: 'white',
      cellTextAlign: 'left',
      cellFontSize: '0.8rem',
      cellFontWeight: 'normal',
      cellPadding: '5px'
    };
  }
}