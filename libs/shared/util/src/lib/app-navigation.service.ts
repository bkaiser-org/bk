import { Injectable, inject } from "@angular/core";
import { Router } from "@angular/router";
import { ModalController } from "@ionic/angular/standalone";
 
@Injectable({ 
  providedIn: "root" 
})
export class AppNavigationService {
  private modalController = inject(ModalController);
  private router = inject(Router);
  private history: string[] = [];

  public cancel(isModal = false): void {
    if (isModal) {
      this.dismissModal();
    } else {
      this.back();
    }
  }

  private dismissModal(): void {
    this.modalController.dismiss(null, 'cancel');
  }
 
  // only suited for pages.
  // for modals, use dismissModal() instead.
  public back(): void {
    this.popLink();
    if (this.history.length > 0) {
      this.router.navigateByUrl(this.history[this.history.length - 1]);
    } else {
      this.router.navigateByUrl('/');
    }
  }

  public pushLink(url: string): void {
    this.history.push(url);
  }

  private popLink(): void {
    this.history.pop();
  }

  public resetLinkHistory(url?: string): void {
    this.history = [];
    if (url) this.history.push(url);
  }

  public getLinkHistory(): string[] { 
    return this.history;
  }
}