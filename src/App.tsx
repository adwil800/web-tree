import './App.css';
import WebSearch from './pages/WebSearch';
import WebScrape from './pages/WebScrape';
import MainLayout from './layout/MainLayout';
import {useState} from 'react';
import {useWTAlert} from './components/context/AlertContext';


function App() {

  const { CWTAlert } = useWTAlert();
  // Handle the transition between pages
  const [webUrl, setWebUrl] = useState<string>('');
  const [isScraping, setIsScraping] = useState<boolean>(false);

  const handleWebUrl = (url: string) => {
    // eslint-disable-next-line no-useless-escape
    const urlRegex = /^\s*(http|https):\/\/[^\s"]+(\s[a-zA-Z0-9#_.\[\]=:"'(),-]+)?\s*$/;
        
    if (!urlRegex.test(url)) {
      console.log('okwad')
      CWTAlert('Please enter a valid URL');
      return;
        
    }

    // Validate the URL
    setWebUrl(url);

    setIsScraping(true);

  }

  const backToSearch = () => {
    setIsScraping(false);
  }
  
  return (

    <MainLayout>

        {isScraping ? (
            <WebScrape webUrl={webUrl} onSearch={handleWebUrl} backToSearch={backToSearch} />
        ) : (
          
            <WebSearch onSearch={handleWebUrl}/>
        )}

 
    </MainLayout>

  );
}

export default App;
