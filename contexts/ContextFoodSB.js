import { createContext, useEffect, useState } from "react";
import { supabase } from "../Back-end/supabase";

export const FoodContext = createContext();

export function FoodProvider({ children }) {
    const [comidas, setComidas] = useState([]);
    const [bebidas, setBebidas] = useState([]);
    const [outros, setOutros] = useState([]);
    const [urls, setFotos] = useState([]);
    useEffect(() => {
        const foodall = async () => {
            try {
                const [{ data: comiData }, { data: bebiData }, { data: otrosData }, { data: files }] = await Promise.all([
                    supabase.from('Comidas').select('*').eq("Disponivel", true),
                    supabase.from('Bebidas').select('*').eq("Disponivel", true),
                    supabase.from('Outras opcoes').select('*').eq("Disponivel", true),
                    supabase.storage.from("Imagens").list(),
                ])
                setComidas(comiData)
                setBebidas(bebiData)
                setOutros(otrosData)
                setFotos(files);
            } catch (error) {
                console.log("ERROR AL OBTENER LOS VALORES \n" + error)
            }

        }
        foodall();
        const interval = setInterval(foodall, 5000);
        return () => clearInterval(interval);
    }, [])
    return (
        <FoodContext.Provider value={{ comidas, bebidas, outros, urls }}>
            {children}
        </FoodContext.Provider>
    )
}