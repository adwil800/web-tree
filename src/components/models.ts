
export interface ScrapedData {
    itemId: string;
    tag: string;
    content?: ScrapedData[] | string;
    attributes?: { [key: string]: string };
}

export type ContentType = 'table' | 'tag' | 'empty' | 'string';

export interface ComponentChildren {
    children: React.ReactNode;
}