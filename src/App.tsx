import './App.css';
import WebSearch from './pages/WebSearch';
import WebScrape from './pages/WebScrape';
import ThemeSwitcher from './components/ThemeSwitcher';
import MainLayout from './layout/MainLayout';
import {useEffect, useState} from 'react';


function App() {

  const [isDarkMode, setIsDarkMode] = useState<boolean | null>(null); ;
  
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


  // Render nothing while isDarkMode is null (loading state)
  if (isDarkMode === null) {
    return null; // Or you can render a loading spinner here if preferred
  }
  
  return (

    <ThemeSwitcher isDarkMode={isDarkMode} >
      <MainLayout toggleTheme={toggleTheme} isDarkMode={isDarkMode}>
        <WebScrape/>
      </MainLayout>
    </ThemeSwitcher>

  );
}

export default App;
