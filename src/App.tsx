import './App.css';
import WebSearch from './pages/WebSearch';
import WebScrape from './pages/WebScrape';
import ThemeSwitcher from './components/ThemeSwitcher';
import MainLayout from './layout/MainLayout';
import {useEffect, useState} from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';


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
    }
  }, []);


  // Handle the transition between pages
  const [webUrl, setWebUrl] = useState<string>('');
  const [isScraping, setIsScraping] = useState<boolean>(false);
  const [transitionClass, setTransitionClass] = useState<string>('slide-left');

  const handleWebUrl = (url: string) => {

    setTransitionClass('slide-left');
    
    // Validate the URL
    setWebUrl(url);

    setTimeout(() => {
      setIsScraping(true);
    }, 100);

  }

  const backToSearch = () => {

    setTransitionClass('slide-right');

    setTimeout(() => {
      setIsScraping(false);
    }, 100);

  }
  
  // Render nothing while isDarkMode is null (loading state)
  if (isDarkMode === null) {
    return null; // Or you can render a loading spinner here if preferred
  }


  
  return (

    <ThemeSwitcher isDarkMode={isDarkMode} >
      <MainLayout toggleTheme={toggleTheme} isDarkMode={isDarkMode}>

      
          <TransitionGroup>
            {isScraping ? (
              <CSSTransition key="scrape" timeout={500} classNames={`${transitionClass}`}>
                <WebScrape webUrl={webUrl} backToSearch={backToSearch} />
              </CSSTransition>
            ) : (
              <CSSTransition key="search" timeout={500} classNames={`${transitionClass}`}>
                <WebSearch onSearch={handleWebUrl} isDarkMode={isDarkMode}/>
              </CSSTransition>
            )}
          </TransitionGroup>


      </MainLayout>
    </ThemeSwitcher>

  );
}

export default App;
