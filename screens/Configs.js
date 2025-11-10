import { StyleSheet, Text, View, TextInput, Image, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect, useContext } from 'react';
import NewButton from '../components/componets';
import { ThemeContext } from '../contexts/themeContext';
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";

export default function Configs({ navigation }) {
  const { theme, darkMode, mudarTema } = useContext(ThemeContext);
  const [name, setName] = useState('');
  const [turma, setTurma] = useState('');
  const [descricao, setDescricao] = useState('');
  const [imgGet, setImg] = useState('');

  // 📸 Seleccionar imagen (compatible con Android, iOS y Web)
  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert("Permissão para acessar a galeria é necessária!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
      base64: Platform.OS === 'web', // ⚡ sólo genera base64 en web
    });

    if (!result.canceled) {
      try {
        let finalUri = '';

        if (Platform.OS === 'web') {
          // 🌐 WEB: guardamos la imagen como Base64
          finalUri = `data:image/jpeg;base64,${result.assets[0].base64}`;
        } else {
          // 📱 MÓVIL: copiamos la imagen a almacenamiento interno
          const filename = `perfil_${Date.now()}.jpg`;
          const newPath = FileSystem.documentDirectory + filename;
          await FileSystem.copyAsync({ from: result.assets[0].uri, to: newPath });
          finalUri = newPath;
        }

        setImg(finalUri);
        await AsyncStorage.setItem('@storage_img', finalUri);
        alert("✅ Imagem salva com sucesso!");

      } catch (error) {
        console.log("Erro ao salvar imagem:", error);
      }
    }
  };

  // 💾 Guardar los datos de usuario
  async function saveName() {
    if (!name || !turma || !descricao) {
      alert("Por favor, preencha todos os campos.");
      return;
    }
    await AsyncStorage.setItem('@storage_Name', name);
    await AsyncStorage.setItem('@storage_Turma', turma);
    await AsyncStorage.setItem('@storage_Descricao', descricao);
    alert("✅ Dados salvos com sucesso!");
  }

  // 📦 Cargar los datos guardados
  useEffect(() => {
    (async () => {
      const NewName = await AsyncStorage.getItem('@storage_Name');
      if (NewName) setName(NewName);

      const NewTurma = await AsyncStorage.getItem('@storage_Turma');
      if (NewTurma) setTurma(NewTurma);

      const NewDescricao = await AsyncStorage.getItem('@storage_Descricao');
      if (NewDescricao) setDescricao(NewDescricao);

      const savedImg = await AsyncStorage.getItem('@storage_img');
      if (savedImg) {
        if (Platform.OS !== 'web') {
          const fileInfo = await FileSystem.getInfoAsync(savedImg);
          if (fileInfo.exists) {
            setImg(savedImg);
          } else {
            console.log("⚠️ Imagem não encontrada, selecione novamente.");
          }
        } else {
          setImg(savedImg);
        }
      }
    })();
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.text, { color: theme.text }]}>Configurações</Text>

      <NewButton onPress={mudarTema}>
        {darkMode ? '🌞' : '🌙'}
      </NewButton>

      <NewButton onPress={pickImage}>Inserir Img</NewButton>

      {imgGet ? (
        <Image
          source={{ uri: imgGet }}
          style={{
            width: 120,
            height: 120,
            borderRadius: 60,
            borderWidth: 2,
            borderColor: theme.text,
          }}
        />
      ) : (
        <Text style={{ color: theme.text }}>Nenhuma imagem salva</Text>
      )}

      <TextInput
        style={[styles.input, { color: theme.text, borderColor: theme.text }]}
        placeholder="Alterar Nome de usuário"
        placeholderTextColor={theme.text}
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={[styles.input, { color: theme.text, borderColor: theme.text }]}
        placeholder="Alterar Turma do usuário"
        placeholderTextColor={theme.text}
        value={turma}
        onChangeText={setTurma}
      />
      <TextInput
        style={[styles.input, { color: theme.text, borderColor: theme.text }]}
        placeholder="Alterar Descrição do usuário"
        placeholderTextColor={theme.text}
        value={descricao}
        onChangeText={setDescricao}
      />

      <NewButton onPress={saveName}>Salvar</NewButton>
      <NewButton onPress={() => navigation.navigate('Login')}>Sair</NewButton>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    height: 50,
    width: 250,
  },
});
