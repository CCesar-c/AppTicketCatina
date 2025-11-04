import { View, Text, Image, StyleSheet } from "react-native";
//import { useNavigation } from "@react-navigation/native";
import { useRoute } from "@react-navigation/native";
export default function DetalhesCompras() {
    const { nombre, Valor, img } = useRoute().params;
    return (
        <View style={styles.container}>
            <Image
                source={{ uri: img }}
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