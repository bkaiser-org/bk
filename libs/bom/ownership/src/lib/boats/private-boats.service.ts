import { Injectable } from "@angular/core";
import { OwnershipService } from "../ownership.service";

@Injectable({
  providedIn: 'root'
})
export class PrivateBoatsService extends OwnershipService {
}