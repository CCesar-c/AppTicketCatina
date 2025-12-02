//Configs.js
import { StyleSheet, Text, View, TextInput, Image, Platform, ScrollView, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect, useContext } from 'react';
import NewButton from '../components/componets';
import { ThemeContext } from '../contexts/themeContext';
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import * as Animatable from 'react-native-animatable';

export default function Configs({ navigation }) {
  const { theme, darkMode, mudarTema } = useContext(ThemeContext);
  const [name, setName] = useState('');
  const [turma, setTurma] = useState('');

  const [descricao, setDescricao] = useState('');
  const [imgGet, setImg] = useState('');

  // 📸 Selecionar imagem (Compativel com Android, iOS e Web)
  const pickImage = async () => {
    const storedEmail = await AsyncStorage.getItem('E-mail');
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
      base64: Platform.OS === 'web',
    });

    if (!result.canceled) {
      try {
        let finalUri = '';

        if (Platform.OS === 'web') {
          // 🌐 WEB: guardamos as imagens como Base64
          finalUri = `data:image/jpeg;base64,${result.assets[0].base64}`;
        } else {
          // 📱 Mobile: ao invés de copiar (pode retornar content:// em Android), salvamos a URI diretamente
          finalUri = result.assets[0].uri;
        }

        setImg(finalUri);
        await AsyncStorage.setItem(`@storage_img${storedEmail}`, finalUri);
        alert("✅ Imagem salva com sucesso!");

      } catch (error) {
        console.log("Erro ao salvar imagem:", error);
        alert('Erro ao salvar a imagem');
      }
    }
  };

  // 💾 Guardar os dados de usuario
  async function saveName() {
    const storedEmail = await AsyncStorage.getItem('E-mail');
    if (!name || !turma || !descricao) {
      alert("Por favor, Preencher todos os campos.");
      return;
    }
    await AsyncStorage.setItem(`@storage_Name${storedEmail}`, name);
    await AsyncStorage.setItem(`@storage_Turma${storedEmail}`, turma);
    await AsyncStorage.setItem(`@storage_Descricao${storedEmail}`, descricao);
    alert("✅ Dados salvos com sucesso!");
  }

  // 📦 Carregar os dados guardados
  useEffect(() => {
    (async () => {
      const storedEmail = await AsyncStorage.getItem('Email');
      const NewName = await AsyncStorage.getItem(`@storage_Name${storedEmail}`);
      if (NewName) setName(NewName);

      const NewTurma = await AsyncStorage.getItem(`@storage_Turma${storedEmail}`);
      if (NewTurma) setTurma(NewTurma);

      const NewDescricao = await AsyncStorage.getItem(`@storage_Descricao${storedEmail}`);
      if (NewDescricao) setDescricao(NewDescricao);

      const savedImg = await AsyncStorage.getItem(`@storage_img${storedEmail}`);
      if (savedImg) {
        // Aceitamos URIs tanto de web (base64)data: como de mobile (file:// ou content://)
        setImg(savedImg);
      }
    })();
  }, []);

  return (


    <View animation="fadeIn" style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>Configurações ⚙️</Text>

      <Text style={[styles.text, { color: theme.text }]}>Tema de Fundo</Text>
      <Animatable.View animation="pulse" iterationCount="infinite">
        <NewButton onPress={mudarTema}>
          {darkMode ? '🌙' : '🌞'}
        </NewButton>
      </Animatable.View>
      <Text style={[styles.text, { color: theme.text }]}>Foto De Usuario 📷</Text>
      {imgGet ? (
        <TouchableOpacity style={{ margin: 30 }} onPress={pickImage}>
          <Image
            source={{ uri: imgGet }}
            style={{
              width: 120,
              height: 120,
              borderRadius: 60,
              borderWidth: 2,
              borderColor: theme.text,
            }} />
        </TouchableOpacity>
      ) :
        (<TouchableOpacity style={{
          width: 120,
          height: 120,
          borderRadius: 60,
          borderWidth: 2,
          borderColor: theme.text
        }} onPress={pickImage}>
        </TouchableOpacity>
        )}

        <View style={{ gap: 15,  margin: 15, alignItems: 'center' }}>
      <Text style={[styles.text, { color: theme.text }]}>Infor do Aluno 🪪</Text>
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

      <NewButton onPress={saveName}>Salvar 💾</NewButton>

      <NewButton onPress={() => navigation.navigate('Login')}>Sair 📤</NewButton>
</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height:'100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 20,
  },
  input: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    height: 50,
    width: 250,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
  }
});
