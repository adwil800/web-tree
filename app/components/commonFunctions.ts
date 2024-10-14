import {ScrapedData} from "./models";

type TagAttributes = {
    [key: string]: string;
};


export const extractAttributes = (attributes: TagAttributes, replaceSelectors = true) => {

  if(!attributes) return []; 

  //Sort attributes, so that id and class are first
  const sortedAttributes = Object.keys(attributes).sort((a, b) => {
    a = a.toLowerCase();
    b = b.toLowerCase();
    if (a === 'id') return -1;
    if (b === 'id') return 1;
    if (a === 'class') return -1;
    if (b === 'class') return 1;
    return 0;
  });

  //Filter by attr by using #, ., or tag
  const attrs = sortedAttributes.map((key) => {

    //Replace key with their respective selector
    const includesKey = ['id', 'class',].includes(key.toLowerCase());

    const selector = includesKey && replaceSelectors ? key.replace('id', '#').replace(/class/gi, '.') : key + '="';
    const attributesValue = selector === '.' ? attributes[key].split(' ').join('.') : attributes[key];

    return `${((!includesKey || !replaceSelectors) && ' ') || ''}${ selector }${ attributesValue }${((!includesKey  || !replaceSelectors) && '"') || ''}`;
      
  });
    
  return attrs

}



export const extractAllIds = (data: Readonly<ScrapedData[]>) => {
  return data.reduce((acc, item) => {
      acc.push(item.itemId);
      if (item.content && Array.isArray(item.content)) {
          acc.push(...extractAllIds(item.content));
      }
      return acc;
  }, [] as string[]);
}
