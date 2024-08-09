import mime from 'mime';

/*------------------------ file pathes -----------------------*/
/*  path = {/}dir{/dir}
    basename = filename.extension
    fullPath = {path/}basename */

/**
 * Extracts the basename from a file path.
 * e.g. path/to/a/filename.txt -> filename.txt
 * @param fullPath path/basename
 * @param sep the separator character
 */
export function basename(fullPath: string, sep = '/'): string {
    return fullPath.substring(fullPath.lastIndexOf(sep) + 1);
}
  
/**
 * Strips the filename from a fullPath.
 * e.g. path/to/a/filename.txt -> path/to/a
 * Will not work on Urls (because of / in queries).
 * See: https://stackoverflow.com/questions/2187256/js-most-optimized-way-to-remove-a-filename-from-a-path-in-a-string
 * @param fullPath 
 * @param sep 
 */
export function dirname(fullPath: string, sep = '/'): string {
    return fullPath.substring(0, fullPath.lastIndexOf(sep));
}

/**
 * Returns the blank baseName without its extension.
 * e.g. filename.txt -> filename
 * @param baseName 
 */
export function stripExtension(baseName: string): string {
    return baseName.substring(0, baseName.lastIndexOf('.'));
}

/**
 * Returns the extension of a full path name.
 * e.g. /a/b/c/filename.txt -> txt
 * @param baseName the base name (e.g. filename.txt)
 */
export function getFileExtension(baseName: string): string {
    return baseName.substring(baseName.lastIndexOf('.') + 1)
}

/**
 * Return the svg logo for a file based on its extension.
 * @param extension the file extension
 * @returns the svg icon name of the logo
 */
export function getLogoByExtension(extension: string): string {
  switch(extension) {
    case 'pdf': return 'assets/filetypes/pdf.svg';
    case 'csv': return 'assets/filetypes/csv.svg';
    case 'xls': 
    case 'xltx':
    case 'xlt':
    case 'xlsx': return 'assets/filetypes/xls.svg';
    case 'pages': return 'assets/filetypes/pages.svg';
    case 'key': return 'assets/filetypes/key.svg';
    case 'numbers': return 'assets/filetypes/numbers.svg';
    case 'jpg': 
    case 'jpeg':
    case 'png':
    case 'gif':
    case 'tif': return 'assets/filetypes/image.svg';
    case 'html': return 'assets/filetypes/html.svg';
    case 'md':
    case 'txt': return 'assets/filetypes/txt.svg';
    case 'doc': 
    case 'dot':
    case 'dotx':
    case 'docx': return 'assets/filetypes/doc.svg';
    case 'mov':
    case 'mp4':
    case 'mpg': return 'assets/filetypes/video.svg';
    case 'zip': return 'assets/filetypes/zip.svg';
    case 'php':
    case 'scss':
    case 'css':
    case 'ts':
    case 'go':
    case 'java':
    case 'js':
    case 'py':
    case 'json': return 'assets/filetypes/code.svg';
    case 'pptx':
    case 'ppt': return 'assets/filetypes/ppt.svg';
    default: return 'assets/filetypes/file.svg';
  }
}

/**
 * Splits a basename into its parts blank basename and extension.
 * e.g. filename.txt -> ['filename', 'txt]
 * @param baseName the base name
 */
export function splitBaseName(baseName: string): string[] {
    if (!baseName) return [];
    const _parts = baseName.split('.');
    if (_parts.length < 1 || _parts.length > 2) {
        console.warn(`util/splitBasename(${baseName}) -> ERROR: invalid basename`);
        return [];
    } else {
        return _parts;
    }
}

export const FileSizeUnits = [
    'bytes',
    'KB',
    'MB',
    'GB',
    'TB',
    'PB'
];

/*
 * Convert bytes into largest possible unit.
 * Takes a precision argument that defaults to 2.
 * Usage:
 *   bytes | fileSize:precision
 * Example:
 *   {{ 1024 |  fileSize}}
 *   formats to: 1 KB
*/
export function fileSizeUnit(bytes = 0, precision = 2): string {
    if (isNaN(parseFloat(String(bytes))) || !isFinite(bytes)) return '?';
    let _unit = 0;
    while (bytes >= 1024) {
        bytes /= 1024;
        _unit++;
    }
    return bytes.toFixed(+ precision) + ' ' + FileSizeUnits[_unit];
}

export function getMimeType(pathOrExtension: string): string {
  return mime.getType(pathOrExtension) ?? '';
}

export function getExtensionFromMimeType(mimeType: string): string {
  return mime.getExtension(mimeType) ?? '';
}

export function isMimeTypeAccepted(mimeType: string, imagesOnly = false): boolean {
  // common images are always accepted
  if (mimeType.startsWith('image/jpeg') || mimeType.startsWith('image/png')) {
    return true;
  } // pdfs are accepted as normal documents
  if (imagesOnly === false && mimeType.startsWith('application/pdf')) {
    return true;
  }
  return false;
}

export function isOfFileType(pathOrExtension: string, mimeType: string): boolean {
  const _mimeType = getMimeType(pathOrExtension);
  return !!((_mimeType && _mimeType.startsWith(mimeType)));
}

export function isImage(pathOrExtension: string): boolean {
  return isOfFileType(pathOrExtension, 'image');
}

export function isPdf(pathOrExtension: string): boolean {
  return isOfFileType(pathOrExtension, 'application/pdf');
}

export function isVideo(pathOrExtension: string): boolean {
  return isOfFileType(pathOrExtension, 'video');
}

export function isAudio(pathOrExtension: string): boolean {
  return isOfFileType(pathOrExtension, 'audio');
}

export function blobToFile(theBlob: Blob, fileName: string): File {
  return new File([theBlob], fileName, { type: theBlob.type, lastModified: Date.now() });
}

/**
 * Convert BASE64 to BLOB
 * @param base64Image Pass Base64 image data to convert into the BLOB
 */
export function convertBase64ToBlob(base64Image: string) {
  // Split into two parts
  const parts = base64Image.split(';base64,');

  // Hold the content type
  const imageType = parts[0].split(':')[1];

  // Decode Base64 string
  const decodedData = window.atob(parts[1]);

  // Create UNIT8ARRAY of size same as row data length
  const uInt8Array = new Uint8Array(decodedData.length);

  // Insert all character code into uInt8Array
  for (let i = 0; i < decodedData.length; ++i) {
    uInt8Array[i] = decodedData.charCodeAt(i);
  }

  // Return BLOB image after conversion
  return new Blob([uInt8Array], { type: imageType });
}

