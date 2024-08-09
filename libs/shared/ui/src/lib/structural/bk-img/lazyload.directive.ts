import { Directive, ElementRef, Renderer2, AfterViewInit, input, inject } from '@angular/core';
import 'lazysizes/plugins/unveilhooks/ls.unveilhooks';

/**
 * Lazyload Directive to lazy load images with lazysites.
 * see: https://lookout.dev/rules/angular-directive-to-lazy-load-images 
 * see other alternative: https://medium.com/@tommybernaciak/image-optimization-lazy-loading-for-angular-using-lazysizes-1b8a1fb8e1f8
 * 
 * Usage examples:
 * 
 * 1) for non-img elements, image is loaded in background with background-image property with
 * - temporary image as value 
 * - data-bg attribute with original image path
 * 
 * <div bk-lazyload={{images.section_backgroud}} class="section">
 *     <p>This is a section</p>
 *  </div>
 * results in:
 * <div class="lazyload" data-bg="{{images.section_backgroud}}" background-image="data:image/gif...">
 * 
 * 2) when using on img element, two attributes are added:
 * - temporary image is added as src
 * - original image path is added as data-src
 * 
 * <img bk-lazyload="footer/linkedin.svg" alt="Linkedin Logo">
 * results in
 * <img class="lazyload" data-src="footer/linkedin.svg" src="data:image/gif..." alt="Linkedin Logo"/>
 * 
 * Usually, this directive should be used with an imgix url.
 * 
 * Use like follows:
 * 1) background:
 *   <div class="avatar" bkLazyload [dataBg]="user.photoURL"></div>
 * 
 * 2) img (HTMLImageElement src)
 *   <img bkLazyload [dataSrc]="user.photoURL" [attr.alt]="user.displayName" />
 *
 * 3) srcset
 *    <img bkLazyload 
 *      dataSrcset="image1.jpg 300w, image2.jpg 600w, image3.jpg 900w" 
 *      [attr.alt]="user.displayName"/>
 */
@Directive({
  selector: '[bkLazyload]',
  standalone: true
})
export class LazyloadDirective implements AfterViewInit {
  private readonly elementRef = inject(ElementRef);
  private readonly renderer = inject(Renderer2);

  public bkLazyLoad = input<string | undefined>();
  public dataBg = input<string | undefined>(); // HTMLElement background-image value
  public dataSizes = input<string | undefined>(); // HTMLImageElement sizes attribute
  public dataSrc = input<string | undefined>(); // HTMLImageElement src attribute
  public dataSrcset = input<string | undefined>(); // HTMLImageElement srcset attribute

  /** a transparent gif, the default small image to use */
  public transparent = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
  el: HTMLElement | undefined;  // the native element

    ngAfterViewInit(): void {
      if (!this.elementRef.nativeElement) {
        return;
      }
      this.el = this.elementRef.nativeElement;
      if (this.el) {
        if (this.el.tagName.toUpperCase() === 'IMG') {
          (this.el as HTMLImageElement).src = this.transparent;
          this.setAttributeSafely(this.dataSizes(), 'data-sizes');
          this.setAttributeSafely(this.dataSrc(), 'data-src');
          this.setAttributeSafely(this.dataSrcset(), 'data-srcset');
        } else {
          this.renderer.setStyle(this.el, 'background-image', `url(${this.transparent})`);
          this.setAttributeSafely(this.dataBg(), 'data-bg');
        }
        this.renderer.addClass(this.el, 'lazyload');  
      }
    }

    private setAttributeSafely(attr: string | undefined, attrName: string): void {
      if (attr) {
        this.renderer.setAttribute(this.el, attrName, attr);
      }
    }
}
