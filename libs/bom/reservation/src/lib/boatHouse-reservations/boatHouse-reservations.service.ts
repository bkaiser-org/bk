import { Injectable } from "@angular/core";
import { ReservationService } from "../reservation.service";
import { DateFormat, convertDateFormatToString, exportXlsx, getTodayStr } from "@bk/util";
import { RelationshipModel } from "@bk/models";
import { ReservationStates, getCategoryName } from "@bk/categories";

export const BoatHouseKey = 'mYhzitO5P0mDrKrThNdD';

@Injectable({
  providedIn: 'root'
})
export class BoatHouseReservationsService extends ReservationService {
  public exportBoathouseReservations(): void {
    const _fileName = getTodayStr() + 'scs_bootshaus_reservationen.xlsx';
    const _reservations = this.filteredItems() as RelationshipModel[];
    const _table: string[][] = [];

    // Add header
    _table.push(['Datum', 'Anlass', 'Name', 'Vorname', 'Areal', 'Teilnehmende', 'Beginn', 'Ende', 'Status', 'Kosten in CHF', 'Eingang Anfrage', 'Bemerkungen']);
    for (const _reservation of _reservations) {
      _table.push([
        convertDateFormatToString(_reservation.validFrom, DateFormat.StoreDate, DateFormat.ViewDate),
        _reservation.name,
        _reservation.subjectName,
        _reservation.subjectName2,
        _reservation.properties.area ?? '',
        _reservation.properties.participants ?? '',
        _reservation.properties.startTime ?? '',
        _reservation.properties.endTime ?? '',
        getCategoryName(ReservationStates, _reservation.state),
        _reservation.price + '',
        _reservation.properties.reservationRef ?? '',
        _reservation.description
      ]);
    }
    exportXlsx(_table, _fileName, 'Bootshaus Reservationen');
  }
}
