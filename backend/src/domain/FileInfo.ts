export default class FileInfo {
  constructor(
    readonly fileName: string,
    readonly path: string,
    readonly userId = '',
    readonly id: string = '',
  ) {
    if (fileName === '') throw new Error('FileName should not be empty!');
    if (path === '') throw new Error('Path should not be empty!');
    if (userId === '') throw new Error('User id should not be empty!');
  }
}
