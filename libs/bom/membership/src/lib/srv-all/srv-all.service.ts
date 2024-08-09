import { Injectable } from "@angular/core";
import { MembershipService } from "../membership.service";

@Injectable({
  providedIn: 'root'
})
export class SrvAllService extends MembershipService {
}