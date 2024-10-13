import './App.css';
import WebSearch from './pages/WebSearch';
import WebScrape from './pages/WebScrape';
import MainLayout from './layout/MainLayout';
import {useEffect, useState} from 'react';
import ThemeSwitcher from './components/layout/ThemeSwitcher';
import WTAlert from './components/layout/WTAlert';


function App() {
  const [isDarkMode, setIsDarkMode] = useState<boolean | null>(null);
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode); 
    localStorage.setItem('isDarkMode', JSON.stringify(!isDarkMode));
  };

  useEffect(() => {
    const currentTheme = localStorage.getItem('isDarkMode');
    if (currentTheme) {
      setIsDarkMode(JSON.parse(currentTheme));
    } else {
      // No theme was set, so let's set the default theme
      localStorage.setItem('isDarkMode', JSON.stringify(false));
      setIsDarkMode(false);
    }
  }, []);


  // Handle the transition between pages
  const [webUrl, setWebUrl] = useState<string>('');
  const [isScraping, setIsScraping] = useState<boolean>(false);

  const [showAlert, setShowAlert] = useState(false);

  const onCloseAlert = () => {
      setShowAlert(false);
  }
  
  const handleWebUrl = (url: string) => {
    // eslint-disable-next-line no-useless-escape
    const urlRegex = /^\s*(http|https):\/\/[^\s"]+(\s[a-zA-Z0-9#_.\[\]=:"'(),-]+)?\s*$/;
        
    if (!urlRegex.test(url)) {

        setShowAlert(true);
        return;
        
    }

    // Validate the URL
    setWebUrl(url);

    setIsScraping(true);

  }

  const backToSearch = () => {
    setIsScraping(false);
  }
  
  // Render nothing while isDarkMode is null (loading state)
  if (isDarkMode === null) {
    return null; // Or you can render a loading spinner here if preferred
  }


  
  return (

    <ThemeSwitcher isDarkMode={isDarkMode} >
      <MainLayout toggleTheme={toggleTheme} isDarkMode={isDarkMode}>

      
          {isScraping ? (
              <WebScrape webUrl={webUrl} onSearch={handleWebUrl} backToSearch={backToSearch} />
          ) : (
            
              <WebSearch onSearch={handleWebUrl} isDarkMode={isDarkMode}/>
          )}


          <WTAlert CloseAlert={onCloseAlert} isOpen={showAlert} type={'error'} message={'Please enter a valid URL'} position={'bottom'} />


      </MainLayout>
    </ThemeSwitcher>

  );
}

export default App;
