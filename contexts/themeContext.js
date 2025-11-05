
import { createContext, useState, useEffect } from 'react';
import { lightTheme, darkTheme } from '../components/themes';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const ThemeContext = createContext({
    theme: lightTheme,
    darkMode: false,
    mudarTema: () => { },
});

export default function ThemeProvider({ children }) {
    const [darkMode, setDarkMode] = useState(false);

    // Cargar tema guardado al iniciar
    useEffect(() => {
        (async () => {
            const storedValue = await AsyncStorage.getItem('themeColors');
            setDarkMode(JSON.parse(storedValue));
        })();
    }, []);

    const theme = darkMode ? darkTheme : lightTheme;

    const mudarTema = async () => {
        const newValue = !darkMode;
        setDarkMode(newValue);
        await AsyncStorage.setItem('themeColors', JSON.stringify(newValue)); 
    };

    return (
        <ThemeContext.Provider value={{ theme, darkMode, mudarTema }}>
            {children}
        </ThemeContext.Provider>
    );
}
