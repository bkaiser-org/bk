import { Injectable } from "@angular/core";
import { TaskService } from "../task.service";

@Injectable({
  providedIn: 'root'
})
export class TaskAllService extends TaskService {
}

