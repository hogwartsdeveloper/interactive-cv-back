import { ISupportService } from "./support.service.interface";
import { injectable } from "inversify";
import puppeteer from "puppeteer";

@injectable()
export class SupportService implements ISupportService {
  async printPDF(url: string): Promise<Buffer> {
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--disable-dev-shm-usage"],
    });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle0" });
    const pdf = await page.pdf({ format: "A4" });
    await browser.close();
    return pdf;
  }
}
