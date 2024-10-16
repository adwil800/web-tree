import axios from "axios";

const ScrapeWebsite = async (path: string, query: Record<string, string>) => {
    try { 

      const response = await axios.post(`http://localhost:3001/api/v1${path}`, query);

      if (response.data.success) {
        return [response.data.data.data];
      } else {
        return [{itemId: '-1', tag: 'No results'}];
      }

    } catch {
          return [{itemId: '-1', tag: 'No results'}];
    }
}; 

export { ScrapeWebsite };
