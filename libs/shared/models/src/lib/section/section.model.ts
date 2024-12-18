import { AlbumStyle, ButtonAction, ColorIonic, GalleryEffect, ImageAction, ModelType } from '@bk/categories';
import { BaseModel } from '../base/base.model';
import { isAudio, isDocument, isImage, isPdf, isStreamingVideo, isVideo, NameDisplay, RoleName } from '@bk/util';

export type Slot = 'start' | 'end' | 'icon-only' | 'none';

export enum ImageType {
  Image,
  Video,
  StreamingVideo,
  Audio,
  Pdf,
  Doc,
  Dir,
  Other
};

export function getImageType(fileName: string): ImageType {
  if (isImage(fileName)) return ImageType.Image;
  // we ignore the streaming video files *.ts as they are listed with the m3u8 file (as StreamingVideo)
  if (isVideo(fileName) && !fileName.endsWith('.ts')) return ImageType.Video;
  if (isStreamingVideo(fileName)) return ImageType.StreamingVideo; 
  if (isAudio(fileName)) return ImageType.Audio;
  if (isPdf(fileName)) return ImageType.Pdf;
  if (isDocument(fileName)) return ImageType.Doc;
  return ImageType.Other;
}

// the configuration of a single image
export interface Image {  // identifies a single image or a specific image in an image list
  imageLabel: string,        // a short title to identify the image (this is shown in lists)
  imageType?: ImageType,     // the type of the image, default is ImageType.Image
  url: string,          // the url of the image, a relative path to the file in Firebase storage; this is used as a basis to construct the imgix url
  actionUrl: string,    // the url used with the action
  altText: string,     // aria text for the image,
  imageOverlay: string, // used for text overlays on the imgix image
  fill: boolean,       // if true, the image fills the whole container, default is true
  hasPriority: boolean, // if true, the image is loaded first, default is true
  imgIxParams?: string,
  width?: number,       // the width of the image in pixels, default is 160
  height?: number,      // the height of the image in pixels, default is 90
  sizes: string,       // the sizes attribute for the img tag, default is '(max-width: 1240px) 50vw, 300px'
  borderRadius: number,
  imageAction: ImageAction, // defines the action to start when clicking on an image, default is ImageAction.None
  zoomFactor: number, // default: 2
  isThumbnail: boolean, // if true, images are displayed as a thumbnail, default: false
  slot: Slot    // default is none
}

// get this from imxig with fm=json
export interface ImageMetaData {
  altitude?: number,   // GPS.Altitude
  latitude?: number,  // GPS.Latitude
  longitude?: number,      // GPS.Longitude
  speed?: number,     // GPS.Speed
  direction?: number,  // GPS.ImgDirection
  size?: number,         // ContentLength
  height?: number,       // PixelHeight
  width?: number,        // PixelWidth   -> portrait = height > width, landscape = width > height
  cameraMake?: string,   // TIFF.Make
  cameraModel?: string,    // TIFF.Model
  software?: string,     // TIFF.Software
  focalLength?: number,   // EXIF.FocalLength mm
  focalLengthIn35mmFilm?: number, // EXIF.FocalLengthIn35mmFilm 35mm equivalent
  aperture?: number,      // EXIF.FNumber  f/2.8
  exposureTime?: number,  // EXIF.ExposureTime
  iso?: number,        // EXIF.ISOSpeedRatings
  lensModel?: string,    // EXIF.LensModel
}

export function newImage(title = '', url = '', actionUrl = '', altText = '', defaultImageConfig = newDefaultImageConfig()): Image {
  return {
    imageLabel: title,
    imageType: ImageType.Image,
    url: url,
    actionUrl: actionUrl,
    altText: altText,
    imageOverlay: '',  
    fill: true,
    hasPriority: false,
    imgIxParams: defaultImageConfig.imgIxParams,
    width: defaultImageConfig.width,
    height: defaultImageConfig.height,
    sizes: defaultImageConfig.sizes,
    borderRadius: defaultImageConfig.borderRadius,
    imageAction: defaultImageConfig.imageAction,
    zoomFactor: defaultImageConfig.zoomFactor,
    isThumbnail: defaultImageConfig.isThumbnail,
    slot: defaultImageConfig.slot
  }
}

// default configuration valid for all images in a image list
export interface DefaultImageConfig {   
  imgIxParams: string,
  width: number,
  height: number,
  sizes: string,
  borderRadius: number, 
  imageAction: ImageAction, 
  zoomFactor: number, 
  isThumbnail: boolean, 
  slot: Slot; 
}


export function newDefaultImageConfig(): DefaultImageConfig {
  return {
    imgIxParams: '',
    width: 160,
    height: 90,
    sizes: '(max-width: 786px) 50vw, 100vw',
    borderRadius: 4,
    imageAction: ImageAction.None,
    zoomFactor: 2,
    isThumbnail: false,
    slot: 'none'
  }
}

// the configuration of a button
export interface Button {
  label?: string, // the label on the button
  shape?: string, // 'round' or 'default' (= undefined)
  fill?: string,  // 'clear', 'outline', 'solid'
  width?: string,  // should be bigger than the iconSize, default is same value for width and height (cicle button)
  height?: string,
  color?: ColorIonic,
  buttonAction?: ButtonAction // default is 'none'
}

// the configuration of an icon
export interface Icon {
  name?: string, // either ion-icon name (e.g. download-outline, contains -) or FileTypeIcon (e.g. pdf) that resolves into assets/filetypes/file-pdf-light.svg
  size?: string,
  slot?: Slot; // default is 'start'
}

// the configuration of an avatar representing a person
export interface Person {
  bkey: string,
  firstName: string,
  lastName: string,
  label: string
}

// the configuration of any BOM
export interface ModelInfo {
  bkey: string,
  modelType: ModelType,
  visibleAttributes: string[]
}

// the configuration of an avatar
export interface Avatar {
  cols: number, // number of columns, 0 - 4, default is 2
  showName: boolean, // if true, the name is displayed, default is true
  showLabel: boolean, // if true, the label is displayed, default is true
  nameDisplay: NameDisplay, // NameDisplay enum, default is FirstLast
  altText: string, // alt text for the image, default is 'avatar'
  title: string,
  linkedSection: string // this section content will be shown in a modal when the title is clicked
}

export interface TableConfig {
  gridTemplate: string,
  gridGap: string,
  gridBackgroundColor: string,
  gridPadding: string,
  headerBackgroundColor: string,
  headerTextAlign: string,
  headerFontSize: string,
  headerFontWeight: string,
  headerPadding: string,
  cellBackgroundColor: string,
  cellTextAlign: string,
  cellFontSize: string,
  cellFontWeight: string,
  cellPadding: string
}

// GuiColumn is header: string, field: string 
export interface Table {
  config: TableConfig,
  header: string[],   // column headers: strings or html
  content: string[]   // field content: strings or html
}

export interface Iframe {
  style: string, // css style for the iframe, default is 'width: 100%; min-height:400px; border: none;'
  title: string, // default is ''
}

export interface AccordionSection {
  key: string,
  label: string,
  value: string
}

export interface Accordion {
  sections: AccordionSection[], // a description of all sections that are contained within the accordion
  value: string; // the selected accordion values
  multiple: boolean, // if true, multiple sections can be opened at the same time, default is false
  readonly: boolean, // if true, the accordion is readonly, default is false
}

export interface AlbumConfig {
  directory: string, // the directory in Firebase storage (relative path)
  albumStyle: AlbumStyle, // the style of the album
  defaultImageConfig: DefaultImageConfig, // the configuration of the images
  recursive: boolean, // if true, the album is shown recursively (several directories deep), default is false
  showVideos: boolean, // if true, videos are shown, default is false
  showStreamingVideos: boolean, // if true, streaming videos are shown, default is true
  showDocs: boolean, // if true, documents are shown, default is false
  showPdfs: boolean, // if true, pdfs are shown, default is true
  galleryEffect: GalleryEffect // the effect used in the gallery, default is GalleryEffect.Slide
}

export interface SectionProperties {
  imageList?: Image[],  // list of images, e.g. Album, Slider, Gallery
  defaultImageConfig?: DefaultImageConfig,  // configures the layout and style of the images
  image?: Image,      // single image, e.g. Hero
  logo?: Image,       // logo image
  avatar?: Avatar,
  album?: AlbumConfig,
  personList?: Person[],
  modelInfo?: ModelInfo,
  table?: Table,
  iframe?: Iframe,
  button?: Button,
  icon?: Icon,
  accordion?: Accordion,
}

export function newAlbumConfig(): AlbumConfig {
  return {
    directory: '',
    albumStyle: AlbumStyle.Pinterest,
    defaultImageConfig: newDefaultImageConfig(),
    recursive: false,
    showVideos: false,
    showStreamingVideos: true,
    showDocs: false,
    showPdfs: true,
    galleryEffect: GalleryEffect.Slide
  }
}

export class SectionModel extends BaseModel {
    public content = '<p></p>';
    public imagePosition = 1; // ViewPosition.Top 
    public colSize = 0; // md-size of the first col, 1-6, default is 4
    public roleNeeded: RoleName = "privileged";
    public color = ColorIonic.Primary; 
    // name: a meaningful name for the section
    // category : SectionType
    // url: 
    // - not needed for single images or ImageLists, use Image instead
    // - MapSection stores the map data in the url field in this format:  "latitude/longitude/zoom" (3 numbers separated by /)
    //   or ///what3word 
    // tags: this is the tag that is used in queries (e.g. for images or for blog posts)
    public properties: SectionProperties = {};

    constructor() {
        super();
        this.modelType = ModelType.Section;
    }
}
