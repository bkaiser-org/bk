import { Injectable } from "@angular/core";
import { BirthdayService } from "../birthday.service";

@Injectable({
  providedIn: 'root'
})
export class ScsBirthdaysService extends BirthdayService {
}