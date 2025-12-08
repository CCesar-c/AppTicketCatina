import { View, Text, Image, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState, useContext } from "react";
import { ThemeContext } from "../contexts/themeContext";
import { useIsFocused } from "@react-navigation/native";

export default function Perfil() {
  const { theme } = useContext(ThemeContext);
  const isFocused = useIsFocused(); 

  const [name, setName] = useState("");
  const [turma, setTurma] = useState("");
  const [descricao, setDescricao] = useState("");
  const [imgUri, setImgUri] = useState(null);

  // 🔄 Recarrega sempre que entrar na tela
  useEffect(() => {
    (async () => {
      try {
        const storedEmail = await AsyncStorage.getItem("Email");

        if (!storedEmail) return;

        const storedName = await AsyncStorage.getItem(`@storage_Name${storedEmail}`);
        const storedTurma = await AsyncStorage.getItem(`@storage_Turma${storedEmail}`);
        const storedDescricao = await AsyncStorage.getItem(`@storage_Descricao${storedEmail}`);
        const storedImg = await AsyncStorage.getItem(`@storage_img${storedEmail}`);

        setName(storedName || "Não informado");
        setTurma(storedTurma || "Não informado");
        setDescricao(storedDescricao || "Sem descrição");
        setImgUri(storedImg || null);

      } catch (err) {
        console.log("Erro ao carregar dados:", err);
      }
    })();
  }, [isFocused]); 

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>

      <Text style={[styles.title, { color: theme.text }]}>Perfil</Text>

      {imgUri ? (
        <Image
          source={{ uri: imgUri }}
          style={styles.image}
          resizeMode="cover"
        />
      ) : (
        <View style={[styles.placeholder, { borderColor: theme.text }]}>
          <Text style={{ color: theme.text, opacity: 0.7 }}>
            Sem foto
          </Text>
        </View>
      )}

      <Text style={[styles.text, { color: theme.text }]}>
        👤 Nome: {name}
      </Text>

      <Text style={[styles.text, { color: theme.text }]}>
        🎓 Turma: {turma}
      </Text>

      <Text style={[styles.text, { color: theme.text }]}>
        📝 Descrição: {descricao}
      </Text>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 20,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 10,
  },
  image: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 2,
    borderColor: "#999",
  },
  placeholder: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    opacity: 0.8,
  },
  text: {
    fontSize: 18,
    textAlign: "center",
    maxWidth: "90%",
  },
});
