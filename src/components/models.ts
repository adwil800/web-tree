
export interface ScrapedData {
    itemId: string;
    tag: string;
    content?: ScrapedData[] | string;
    attributes?: { [key: string]: string };
}

export type contentType = 'table' | 'tag' | 'empty' | 'string';