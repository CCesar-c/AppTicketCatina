import { createContext, useState } from 'react';
import { lightTheme, darkTheme } from '../components/themes';

export const ThemeContext = createContext({
    theme: lightTheme,
    darkMode: false,
    mudarTema: () => { },
});


export default function ThemeProvider({ children }) {

    const [darkMode, setDarkMode] = useState(false);

    const theme = darkMode ? darkTheme : lightTheme;

    const mudarTema = () => {
        setDarkMode(!darkMode);
    }

    return (
        <ThemeContext.Provider value={{ theme, darkMode, mudarTema }}>
            {children}
        </ThemeContext.Provider>
    )
}