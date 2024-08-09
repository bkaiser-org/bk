import { Injectable } from "@angular/core";
import { OwnershipService } from "../ownership.service";
import { RelationshipModel } from "@bk/models";
import { bkTranslate } from "@bk/util";
import { exportLockers } from "./lockers.util";

@Injectable({
  providedIn: 'root'
})
export class MaleLockersService extends OwnershipService {
  /**
   * Export the locker information.
   */
    public async exportLockers(): Promise<void> {
      await exportLockers(this.filteredItems() as RelationshipModel[], bkTranslate('@ownership.select.lockers'));
    }
}