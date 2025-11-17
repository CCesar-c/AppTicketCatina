import { View, Text, Image, StyleSheet } from "react-native";
import { useRoute } from "@react-navigation/native";
import { useContext, useState, useEffect } from "react";
import { ThemeContext } from "../contexts/themeContext";
import * as Animatable from 'react-native-animatable';

export default function DetalhesCompras() {
    const { nombre, Valor, img, Estoque } = useRoute().params;
    const { theme } = useContext(ThemeContext);
    return (
        <Animatable.View animation="zoomIn" duration={500} style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={[styles.container, { backgroundColor: theme.background }]}>
                <Image
                    source={{ uri: img }}
                    style={styles.image}
                    resizeMode="contain"
                />
                <Text style={[styles.text, { color: theme.text }]}>{nombre}</Text>

                <Text style={[styles.text, { color: theme.text }]}>💰{Valor}$</Text>

                <Text style={[styles.text, { color: theme.text }]}> Estoque: {Estoque}</Text>
            </View>
        </Animatable.View>
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