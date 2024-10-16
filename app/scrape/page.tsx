import {ScrapeWebsite} from "../api/scrape/controller";
import {extractAllIds} from "../components/commonFunctions";
import WTTreeView from "../components/WebScrape/WTTreeView/WTTreeView";


interface ScrapedData {
  itemId: string;
  tag: string;
  content?: ScrapedData[] | string;
  attributes?: { [key: string]: string };
}
   
export default function WebScrape () {

  const scrapedData: ScrapedData[] = [];
  const selectedIds = new Set<string>();

  const getScrapedData = async (url: string) => {

    if(!url) {
      return;
    }

    const scrapedData = await ScrapeWebsite('/scrape', {url});

  }

  const handleTreeClick = (itemId: string, selectionType: 'node' | 'tree') => {

    let itemsToAdd = new Set<string>([itemId]);

    if(selectionType === 'tree' && scrapedData.length) {

      const currentItem = findCurrentItem(itemId, scrapedData[0]);
          
      if(currentItem === null) return;
        itemsToAdd = new Set([...itemsToAdd, ...extractAllIds([currentItem])]);

    } 
      
      // Add items to the selectedIds state if they are not already present
      const newItemsToAdd = [...itemsToAdd].filter((itemId) => !selectedIds.has(itemId));
    im here moving  WTTReeview to server Component, do the same with wttable
      if(newItemsToAdd.length > 0) {
        setSelectedIds((prevSelectedIds) => {
            return new Set([...prevSelectedIds, ...newItemsToAdd]);
        });
      }
      
  }

  const findCurrentItem = (itemId: string, data: ScrapedData): ScrapedData | null => {
      if(data.itemId === itemId) return data;

      if(Array.isArray(data.content)) {
      for(const child of data.content) {
          const result = findCurrentItem(itemId, child);
          if(result) return result;
      }
      }

      return null;
  }

  return (
    <WTTreeView scrapedData={scrapedData} selectedIds={selectedIds} onClick={handleTreeClick} onAddOnSearch={onTreeAddOnSearch} />
  );

};

