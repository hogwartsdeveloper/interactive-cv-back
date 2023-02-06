export interface ISupportService {
  printPDF: (url: string) => Promise<Buffer>;
}
