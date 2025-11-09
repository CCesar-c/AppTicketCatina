import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useState, useEffect } from 'react';


export const MoneyContext = createContext();

export function MoneyProvider({ children }) {
    const [creditos, setCreditos] = useState("");
    const [_, setTime] = useState(0);

    const respons = async () => {
        try {
            const res = await AsyncStorage.getItem("creditos");
            if (res) setCreditos(res);
        } catch (error) {
            console.error("Erro ao carregar saldo:", error);
        }
    };
    useEffect(() => {
        respons();
        const interval = setInterval(() => {
            setTime(prev => prev + 1);
            respons();
        }, 2500);

        return () => {
            clearInterval(interval);
        };
    }, [])

    return (
        <MoneyContext.Provider value={{ creditos }} >
            {children}
        </MoneyContext.Provider>
    )
}