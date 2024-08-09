import { Injectable } from "@angular/core";
import { OwnershipService } from "../ownership.service";
import { bkTranslate } from "@bk/util";
import { RelationshipModel } from "@bk/models";
import { exportLockers } from "./lockers.util";

@Injectable({
  providedIn: 'root'
})
export class FemaleLockersService extends OwnershipService {
    /**
   * Export the locker information.
   */
    public async exportLockers(): Promise<void> {
      await exportLockers(this.filteredItems() as RelationshipModel[], bkTranslate('@ownership.select.lockers'));
    }
}