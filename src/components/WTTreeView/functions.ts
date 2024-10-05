import {ScrapedData} from "../models";
const matchesSelector = (element: ScrapedData, selector: string, allowDescendants: boolean = false): { matches: boolean; matchedItemId?: string } => {
    const tagRegex = /^[a-z]+/i;
    const classRegex = /\.([a-zA-Z0-9_-]+)/g; 
    const idRegex = /#([a-zA-Z0-9_-]+)/;
    const contentRegex = /"(.*?)"/; 

    const tagMatch = selector.match(tagRegex);
    const classMatches = [...selector.matchAll(classRegex)].map(match => match[1]);
    const idMatch = selector.match(idRegex);
    const contentMatch = selector.match(contentRegex); 

    let matches = true;
    let matchedItemId: string | undefined;

    // Match tag if provided
    if (tagMatch && element.tag !== tagMatch[0]) {
        matches = false;
    }

    // Match all classes if provided
    if (classMatches.length > 0) {
        const classList = element.attributes?.class?.toLowerCase().split(" ") || [];
        if (!classMatches.every(cls => classList.includes(cls.toLowerCase()))) {
            matches = false;
        }
    }

    // Match ID if provided
    if (idMatch && (!element.attributes?.id || element.attributes?.id !== idMatch[1])) {
        matches = false;
    }

    // Match content if provided
    if (contentMatch) {
        const contentString = typeof element.content === 'string' ? element.content : '';

        if (allowDescendants) {
            
            const matchInDescendants = (el: ScrapedData): string | undefined => {
                if (typeof el.content === 'string' && el.content.toLowerCase().includes(contentMatch[1].toLowerCase())) {
                    return el.itemId; // Return the matched item's ID
                }
                if (Array.isArray(el.content)) {
                    for (const child of el.content) {
                        const foundId = matchInDescendants(child);
                        if (foundId) return foundId; // Return the first matched item's ID found
                    }
                }
                return undefined;
            };

            // Check for matches in descendants
            matchedItemId = matchInDescendants(element);
            if (!matchedItemId) {
                matches = false;
            }
        } else {
            if (!contentString.toLowerCase().includes(contentMatch[1].toLowerCase())) {
                matches = false;
            }
        }
    }

    return { matches, matchedItemId };
};

export const filterBySelector = (data: ScrapedData[], selector: string): { path: string[], itemId: string }[] => {
    const selectors = selector.split(" ");
    let result: { path: string[], itemId: string }[] = [];

    const recursiveFilter = (elements: ScrapedData[], remainingSelectors: string[], currentPath: string[], allowDescendants: boolean) => {
        const currentSelector = remainingSelectors[0];
        const nextSelectors = remainingSelectors.slice(1);

        for (const element of elements) {
            const newPath = [...currentPath, element.itemId];

            // Check if current element matches current selector
            const { matches, matchedItemId } = matchesSelector(element, currentSelector, allowDescendants);
            if (matches) {
                if (nextSelectors.length === 0) {
                    // If this is the last selector, add the matched element and its path

                    if(matchedItemId) newPath.push(matchedItemId);

                    result.push({ path: newPath, itemId: matchedItemId || element.itemId });
                } else if (element.content && Array.isArray(element.content)) {
                    // If more selectors, go deeper into the content
                    recursiveFilter(element.content, nextSelectors, newPath, allowDescendants);
                }
            } else if (element.content && Array.isArray(element.content)) {
                // Continue traversing to find descendants
                recursiveFilter(element.content, remainingSelectors, newPath, allowDescendants);
            }
        }
    };

    const hasContentSelector = / +"(.*?)"/.test(selector);
    const allowDescendants = selectors.length > 1 && hasContentSelector; // Determines if we're searching in descendants for content (separated by a space and then content in quotes)

    recursiveFilter(data, selectors, [], allowDescendants);

    return result;
};


export const extractIds = (results: { path: string[], itemId: string }[]): string[][] => {
    // Get all pathIds and all itemIds
    const pathIds =  Array.from(new Set(results.flatMap(({ path }) => path)));
    const itemIds =  Array.from(new Set(results.flatMap(({ itemId }) => itemId)));

    return [pathIds, itemIds];

}
