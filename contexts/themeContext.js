import React, {createContext, useState, useContext} from 'react';
import { lightTheme, darkTheme } from '../components/themes';

export const ThemeContext = createContext({
    theme: lightTheme,
    darkMode: false,
    mudarTema: () => {},
});


function ThemeProvider({children}) {

const [darkMode, setDarkMode] = useState(false);
const theme = darkMode ? darkTheme : lightTheme;
const mudarTema = () => {
    setDarkMode(!darkMode);
}

    return(
        <ThemeContext.Provider value={{theme, darkMode, mudarTema}}>
            {children}
        </ThemeContext.Provider>
    )
}

export default ThemeProvider;