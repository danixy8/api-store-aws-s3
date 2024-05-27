
export class EncodeFilename {

  static encodeFilenameForUrl(name: string) {
    const parts = name.split('/');
    const encodedFileName = encodeURIComponent(parts.pop() || '');
    const encodedUrl = [...parts, encodedFileName].join('/');
    return encodedUrl;
  }
}