import { View, Text, Image, StyleSheet } from "react-native";
//import { useNavigation } from "@react-navigation/native";
import { useRoute } from "@react-navigation/native";
import { supabase } from '../Back-end/supabase';
export default function DetalhesCompras() {
    const [fotoUrl, setFotoUrl] = useState("");
    useEffect(() => {
        const buscarFoto = async () => {
          
          const url = "https://meuservidor.com/imagens/aluno1.jpg";
          setFotoUrl(url);
        };
        buscarFoto();
      }, []);
    
    const result = useRoute();
    const { fotoproduto, nombre, valor } = result.params;
    
        const fetchGeneral = async () => {
          const { data: img } = await supabase
            .storage
            .from("Imagens")
            .list('*')
        }
        fetchGeneral();
    return (
        <View style={styles.container}>
            <Image
                source={{ uri: fotoproduto }}
                style={styles.image}
                resizeMode="contain"
            />
            <Text style={styles.text}>{nombre}</Text>
            <Text style={styles.text}>💰 {Valor} contos</Text>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#fff",
        padding: 20,
    },
    image: {
        width: 200,
        height: 200,
        marginBottom: 20,
        borderRadius: 10,
    },
    text: {
        fontSize: 18,
        fontWeight: "bold",
        textAlign: "center",
        color: "#333",
    },
});