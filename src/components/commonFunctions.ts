
type TagAttributes = {
    [key: string]: string;
};


export const extractAttributes = (attributes: TagAttributes, replaceSelectors = true) => {

    //Filter by attr by using #, ., or tag
    const attrs = attributes ? Object.keys(attributes).map((key) => {

      //Replace key with their respective selector
      const includesKey = ['class', 'id'].includes(key.toLowerCase());
      const selector = includesKey && replaceSelectors ? key.replace(/class/gi, '.').replace('id', '#') : key + '="';

      return `${(!includesKey && ' ') || ''}${selector}${ attributes && attributes[key]}${((!includesKey  || !replaceSelectors) && '"') || ''}`;
      
  }) : [];

  return attrs

}