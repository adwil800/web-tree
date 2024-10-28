import { createContext, useContext, useState } from 'react';
import {ComponentChildren} from '../models';
import WTAlert from '../layout/WTAlert'; 

interface AlertContextType {
  CWTAlert: (message: string) => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const useWTAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useWTAlert must be used within a WTAlertProvider');
  }
  return context;
};

export const WTAlertProvider = ({ children }: Readonly<ComponentChildren>) => {

  const [showAlert, setShowAlert] = useState(false);
  const [message, setMessage] = useState('');

  const onCloseAlert = () => {
      setShowAlert(false);
  }

  const CWTAlert = (message: string) => {

    if(!message || showAlert) {
      return;
    }

    setMessage(message);
    setShowAlert(true);

  }

  return (
    <AlertContext.Provider value={{ CWTAlert }}> 
      {children}
      <WTAlert CloseAlert={onCloseAlert} isOpen={showAlert} type={'error'} message={message} position={'bottom'} /> 
    </AlertContext.Provider>
  );
  
};
