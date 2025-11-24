// contextmoney.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useState, useEffect } from 'react';
import { supabase } from '../Back-end/supabase';

export const MoneyContext = createContext();

export function MoneyProvider({ children }) {
    const [Valor, setValor] = useState(0);
    const [_, setTime] = useState(0);

    const respons = async () => {
        try {
            const storedEmail = await AsyncStorage.getItem('Email');
            if (!storedEmail) return;

            const { data, error } = await supabase
                .from("users")
                .select("money")
                .eq("Emails", storedEmail)
                .single();

            if (error) console.log(error);

            if (data) setValor(Number(data.money));
        } catch (error) {
            console.error("Erro ao carregar saldo:", error);
        }
    };

    useEffect(() => {
        respons();
        const interval = setInterval(() => {
            setTime(prev => prev + 1);
            respons();
        }, 5000);
        return () => {
            clearInterval(interval);
        };
    }, []);

    return (
        <MoneyContext.Provider value={{ Valor }}>
            {children}
        </MoneyContext.Provider>
    );
}