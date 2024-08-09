import { Injectable } from "@angular/core";
import { TripService } from "../trip.service";

@Injectable({
  providedIn: 'root'
})
export class TripAllService extends TripService {
}

