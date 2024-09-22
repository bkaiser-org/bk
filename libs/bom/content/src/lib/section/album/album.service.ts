import { computed, inject, Injectable, signal } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { AlbumStyle, ImageAction } from "@bk/categories";
import { Image } from "@bk/models";
import { ENV, STORAGE } from "@bk/util";
import { listAll, ref, StorageReference } from "firebase/storage";
import { catchError, EMPTY, from, Subject, switchMap, tap } from "rxjs";

export interface AlbumState {
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

  private state = signal<AlbumState>({
    directory: 'tenant/' + this.env.auth.tenantId + '/album',
    albumStyle: AlbumStyle.Grid,
    images: [],
    isLoading: false,
    error: null
  });

  // selectors (select a piece of state)
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
      tap((dir => this.setDirectory(dir))),
      switchMap((dir) => from(this.listAll(dir))),
      takeUntilDestroyed(),
      catchError(err => {
        this.setError('Failed to load images: ' + JSON.stringify(err));
        return EMPTY;  // Ensures the stream doesn't break
      })
    ).subscribe((images) => { 
      console.log('AlbumService -> images: ', images);
      this.setImages(images); 
    });
    this.selectedAlbumStyle$.pipe(
      tap((albumStyle) => this.setAlbumStyle(albumStyle)));
   }

   // reducers (how actions update state)
   private setDirectory(directory: string): void {
    console.log('AlbumService.setDirectory -> directory: ' + directory);
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

  public setCurrentDirectory(directory: string): void {
    console.log('AlbumService.setCurrentDirectory -> directory: ' + directory);
    this.selectedDirectory$.next(directory);
  }

  public setCurrentAlbumStyle(albumStyle: AlbumStyle): void {
    console.log('AlbumService.setCurrentAlbumStyle -> albumStyle: ' + albumStyle + ' of type: ' + typeof albumStyle);
    this.selectedAlbumStyle$.next(albumStyle);
  }

  private async listAll(directory: string): Promise<Image[]> {
    console.log('AlbumService.listAll -> directory: ' + directory);
    const _images: Image[] = [];
    try {
      const _listRef = ref(this.storage, directory);

      // listAll returns prefixes (= subdirectories) and items (= files)
      const _result = await listAll(_listRef);
      
      // list all subdirectories in the directory
      _result.prefixes.forEach((_dir) => {
        _images.push(this.getDirImage(_dir, 'logo/filetypes/folder.svg', this.directory() + '/' + _dir.name));
      });
  
      // list all files in the directory
      _result.items.forEach((_file) => {
        _images.push(this.getImage(_file, this.directory() + '/' + _file.name, ''));
      });
        console.log('AlbumService.listAll -> images: ', _images);
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

  private getImage(ref: StorageReference, url: string, actionUrl: string): Image {
    return {
      imageLabel: ref.name,
      url: url,
      actionUrl: actionUrl,
      altText: ref.name,
      imageOverlay: '',
      fill: true,
      hasPriority: false,
      imgIxParams: '',
      width: 400,
      height: 400,
      sizes: '(max-width: 786px) 50vw, 100vw',
      borderRadius: 4,
      imageAction: ImageAction.OpenSlider,
      zoomFactor: 2,
      isThumbnail: false,
      slot: 'icon-only'
    };
  }

  private getDirImage(ref: StorageReference, url: string, actionUrl: string): Image {
    return {
      imageLabel: ref.name,
      url: url,
      actionUrl: actionUrl,
      altText: ref.name + ' directory',
      imageOverlay: '',
      fill: false,
      hasPriority: false,
      imgIxParams: '',
      width: 100,
      height: 100,
      sizes: '(max-width: 786px) 50vw, 100vw',
      borderRadius: 4,
      imageAction: ImageAction.OpenDirectory,
      zoomFactor: 2,
      isThumbnail: false,
      slot: 'icon-only'
    };
  }
}
