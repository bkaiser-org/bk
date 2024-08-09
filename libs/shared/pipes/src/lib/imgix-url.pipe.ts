import { Pipe, PipeTransform } from '@angular/core';
import { Image } from '@bk/models';
import { getImgixUrl, getSizedImgixParamsByExtension, getThumbnailUrl } from '@bk/util';

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
  const _params = getSizedImgixParamsByExtension(image.url, image.width, image.height);
  return getImgixUrl(image.url, _params);
}
