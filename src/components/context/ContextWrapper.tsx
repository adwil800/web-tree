import {ComponentChildren} from "../models";
import {WTAlertProvider} from "./AlertContext";
import {WTThemeProvider} from "./ThemeContext";



export default function ContextWrapper({ children }: ComponentChildren) {
  return (
    <WTThemeProvider>
      <WTAlertProvider>
        {children}
      </WTAlertProvider>
    </WTThemeProvider>
  );
}