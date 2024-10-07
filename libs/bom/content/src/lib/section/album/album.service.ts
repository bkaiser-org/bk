import { computed, inject, Injectable, signal } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { AlbumStyle, GalleryEffects, getCategoryName, ImageAction } from "@bk/categories";
import { AlbumConfig, getImageType, Image, ImageType, newAlbumConfig } from "@bk/models";
import { ENV, STORAGE, warn } from "@bk/util";
import { ModalController } from "@ionic/angular/standalone";
import { listAll, ref, StorageReference } from "firebase/storage";
import { catchError, EMPTY, from, Subject, switchMap, tap } from "rxjs";
import { GalleryModalComponent } from "../gallery/gallery.modal";

export interface AlbumState {
  config: AlbumConfig;
  directory: string;
  albumStyle: AlbumStyle;
  images: Image[],
  isLoading: boolean;
  error: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class AlbumService {
  private env = inject(ENV);
  private storage = inject(STORAGE);
  private modalController = inject(ModalController);

  private state = signal<AlbumState>({
    config: newAlbumConfig(),
    directory: 'tenant/' + this.env.auth.tenantId + '/album',
    albumStyle: AlbumStyle.Grid,
    images: [],
    isLoading: false,
    error: null
  });

  // selectors (select a piece of state)
  public config = computed(() => this.state().config);
  public directory = computed(() => this.state().directory);
  public albumStyle = computed(() => this.state().albumStyle);
  public images = computed(() => this.state().images);
  public isLoading = computed(() => this.state().isLoading);
  public error = computed(() => this.state().error);
  public title = computed(() => this.directory().split('/').pop());
  public currentDirLength = computed(() => this.directory().split('/').length);
  public parentDirectory = computed(() => this.directory().split('/').slice(0, -1).join('/'));

  private selectedDirectory$ = new Subject<string>();
  private selectedAlbumStyle$ = new Subject<AlbumStyle>();

  // actions
  constructor() {
    this.selectedDirectory$.pipe(
      tap(() => this.setLoadingIndicator(true)),
      tap(dir => this.setDirectory(dir)),
      switchMap((dir) => from(this.listAll(dir))),
      takeUntilDestroyed(),
      catchError(err => {
        this.setError('Failed to load images: ' + JSON.stringify(err));
        return EMPTY;  // Ensures the stream doesn't break
      })
    ).subscribe((images) => { 
      this.setImages(images); 
    });
    this.selectedAlbumStyle$.pipe(
      tap(albumStyle => this.setAlbumStyle(albumStyle)),
      takeUntilDestroyed(),
      catchError(err => {
        this.setError('Failed to set album style: ' + JSON.stringify(err));
        return EMPTY;  // Ensures the stream doesn't break
      })).subscribe((style) => {
        console.log('AlbumService -> albumStyle: ', style);
      });
   }

   // reducers (how actions update state)
   private setDirectory(directory: string): void {
    this.state.update((_state) => ({
      ..._state,
      directory: directory
    }));
  }

  private setAlbumStyle(albumStyle: AlbumStyle): void {
    this.state.update((_state) => ({
      ..._state,
      albumStyle: albumStyle
    }));
  }
  //   setDefaultImageConfig(config: DefaultImageConfig): void 

  private setImages(newImages: Image[]): void {
    this.state.update((_state) => ({
      ..._state,
      images: newImages,
      isLoading: false
    }));
  }

  private setLoadingIndicator(newIsLoading: boolean): void {
    this.state.update((_state) => ({
      ..._state,
      isLoading: newIsLoading
    }));
  }

  private setError(error: string): void {
    this.state.update((_state) => ({
      ..._state,
      error: error
    }));
  }

  public initialize(config: AlbumConfig | undefined): void {
    if (!config) {
      warn('AlbumService.initialize: config is undefined');
      config = newAlbumConfig();
    }
    this.state.update((_state) => ({
      ..._state,
      config: config
    }));
    this.setCurrentDirectory(config.directory);
    this.setCurrentAlbumStyle(config.albumStyle);
  }

  public setCurrentDirectory(directory: string): void {
    this.selectedDirectory$.next(directory);
  }

  public setCurrentAlbumStyle(albumStyle: AlbumStyle): void {
    this.selectedAlbumStyle$.next(albumStyle);
  }

  private async listAll(directory: string): Promise<Image[]> {
    const _images: Image[] = [];
    try {
      const _listRef = ref(this.storage, directory);

      // listAll returns prefixes (= subdirectories) and items (= files)
      const _result = await listAll(_listRef);
      
      // list all subdirectories in the directory
      _result.prefixes.forEach((_dir) => {
        _images.push(this.getImage(_dir, ImageType.Dir));
      });
  
      // list all files in the directory
      _result.items.forEach((_file) => {
        const _imageType = getImageType(_file.name);
        switch(_imageType) {
          case ImageType.Image:
            _images.push(this.getImage(_file, _imageType));
            break;
          case ImageType.Video:
            if (this.config().showVideos) {
              _images.push(this.getImage(_file, _imageType));
            }
            break;
          case ImageType.StreamingVideo:
            if (this.config().showStreamingVideos) {
              _images.push(this.getImage(_file, _imageType));
            }
            break;
          case ImageType.Pdf: 
            if (this.config().showPdfs) {
              _images.push(this.getImage(_file, _imageType));
            }
            break;
          case ImageType.Doc:
            if (this.config().showDocs) {
              _images.push(this.getImage(_file, _imageType));
            }
            break;
          case ImageType.Audio:
          default: 
            break;
        }
      });
    }
    catch(_ex) {
      const _err = JSON.stringify(_ex);
      console.error('AlbumService.listAll -> error: ' + _err);
      this.setError(_err);
    }
    return _images;  
  }

  public goUp(): void {
    this.setCurrentDirectory(this.parentDirectory());
  }

  /**
   * Return a thumbnail representation of the file given based on its mime type.
   * image:  thumbnail image
   * video:  move icon to download the video
   * streaming video: ix-player (bk-video)
   * other:  file icon to download the file
   * @param ref 
   * @param url 
   * @param actionUrl 
   * @returns 
   */
  private getImage(ref: StorageReference, imageType: ImageType): Image {
    return {
      imageLabel: ref.name,
      imageType: imageType,
      url: this.getUrl(imageType, ref.name),
      actionUrl: this.getActionUrl(imageType, ref.name),
      altText: (imageType === ImageType.Dir) ? ref.name + ' directory' : ref.name,
      imageOverlay: '',
      fill: (imageType === ImageType.Image) ? true : false,
      hasPriority: false,
      imgIxParams: '',
      width: (imageType === ImageType.Image) ? 400 : 100,
      height: (imageType === ImageType.Image) ? 400 : 100,
      sizes: '(max-width: 786px) 50vw, 100vw',
      borderRadius: 4,
      imageAction: this.getImageAction(imageType),
      zoomFactor: 2,
      isThumbnail: false,
      slot: 'icon-only'
    };
  }

  private getImageAction(imageType: ImageType): ImageAction {
    switch(imageType) {
      case ImageType.Image: return ImageAction.OpenSlider;
      case ImageType.Pdf:
      case ImageType.Audio:
      case ImageType.Doc:
      case ImageType.Video: return ImageAction.Download;
      case ImageType.Dir: return ImageAction.OpenDirectory;
      default: return ImageAction.None;
    }
  }

  private getUrl(imageType: ImageType, fileName: string): string {
    switch(imageType) {
      case ImageType.Image: return this.directory() + '/' + fileName;
      case ImageType.Video: return 'logo/filetypes/video.svg';
      case ImageType.StreamingVideo: return this.env.app.imgixBaseUrl + '/' + this.directory() + '/' + fileName;
      case ImageType.Audio: return 'logo/filetypes/audio.svg';
      case ImageType.Pdf: return this.directory() + '/' + fileName;
      case ImageType.Doc: return 'logo/filetypes/doc.svg';
      case ImageType.Dir: return 'logo/filetypes/folder.svg';
      default: return 'logo/filetypes/file.svg';
    }
  }

  private getActionUrl(imageType: ImageType, fileName: string): string {
    const _downloadUrl = this.env.app.imgixBaseUrl + '/' + this.directory() + '/' + fileName;
    switch(imageType) {
      case ImageType.Video: 
      case ImageType.Audio:
      case ImageType.Doc:
      case ImageType.Pdf: return _downloadUrl;
      case ImageType.Dir: return this.directory() + '/' + fileName;
      default: return '';
    }
  }

  public async openGallery(files: Image[], title = '', initialSlide = 0): Promise<void> {
    const _images = files.filter((file) => file.imageType === ImageType.Image);
    const _modal = await this.modalController.create({
      component: GalleryModalComponent,
      cssClass: 'full-modal',
      componentProps: {
        imageList: _images,
        initialSlide: initialSlide,
        title: title,
        effect: getCategoryName(GalleryEffects, this.config().galleryEffect)
      }
    });
    _modal.present();

    await _modal.onWillDismiss();
  }
}
