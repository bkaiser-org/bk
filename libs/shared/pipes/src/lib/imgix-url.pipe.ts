import { Pipe, PipeTransform } from '@angular/core';
import { Image } from '@bk/models';
import { die, getImgixUrl, getSizedImgixParamsByExtension, getThumbnailUrl } from '@bk/util';

@Pipe({
  name: 'imgixUrl',
  standalone: true
})
export class ImgixUrlPipe implements PipeTransform {

  transform(image: Image): string {
    if (image.isThumbnail === true) {
      return getThumbnailUrl(image.url, 200, 200);
    }
    return getImgixUrlFromImage(image);
  }
}

export function getImgixUrlFromImage(image: Image): string {
  if (!image.width || !image.height) die('ImgixUrlPipe: image width and height must be set');
  const _params = getSizedImgixParamsByExtension(image.url, image.width, image.height);
  return getImgixUrl(image.url, _params);
}
