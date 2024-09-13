import { Image } from "@bk/models";
import { ImageViewModalComponent } from "./modals/image-view.modal";
import { ModalController } from "@ionic/angular/standalone";

export function getCheckboxIcon(checkboxValue: boolean): string {
    return (checkboxValue ? 'checkbox-outline' : 'square-outline');
}

export interface ValidationInfo {
  type: string,
  message: string
};

export interface ValidationInfoDictionary {
  username: ValidationInfo[],
  mandatoryName: ValidationInfo[],
  name: ValidationInfo[],
  email: ValidationInfo[],
  phone: ValidationInfo[],
  password: ValidationInfo[],
  confirm_password: ValidationInfo[],
  matching_passwords: ValidationInfo[],
  terms: ValidationInfo[],
}

// show a zoomed version of the image in a modal
export async function showZoomedImage(modalController: ModalController, title: string, image: Image, cssClass = 'zoom-modal'): Promise<void> {
  if (image.isZoomable === false) return;
  const _modal = await modalController.create({
    component: ImageViewModalComponent,
    cssClass: cssClass,
    componentProps: {
      title: title,
      image: image
    }
  });
  _modal.present();
  await _modal.onDidDismiss();
}