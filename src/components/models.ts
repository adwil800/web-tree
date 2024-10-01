
export interface ScrapedData {
    itemId: string;
    tag: string;
    content?: ScrapedData[] | string;
    attributes?: { [key: string]: string };
}