import './App.css';
import WebSearch from './pages/WebSearch';
import WebScrape from './pages/WebScrape';
import MainLayout from './layout/MainLayout';
import {useEffect, useState} from 'react';
import ThemeSwitcher from './components/layout/ThemeSwitcher';


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

  const handleWebUrl = (url: string) => {

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
              <WebScrape webUrl={webUrl} backToSearch={backToSearch} />
          ) : (
            
              <WebSearch onSearch={handleWebUrl} isDarkMode={isDarkMode}/>
          )}


      </MainLayout>
    </ThemeSwitcher>

  );
}

export default App;
