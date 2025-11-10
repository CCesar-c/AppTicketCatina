import { StyleSheet, Text, View, TextInput, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect, useContext } from 'react';
import NewButton from '../components/componets';
import { ThemeContext } from '../contexts/themeContext';
import * as ImagePicker from "expo-image-picker";

export default function Configs({navigation}) {
  const { theme, darkMode, mudarTema } = useContext(ThemeContext);
  const [name, setName] = useState('');
  const [turma, setTurma] = useState('');
  const [descricao, setDescricao] = useState('')
  const [imgGet, setImg] = useState('');

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
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setImg(uri);
      await AsyncStorage.setItem('@storage_img', uri);
    }
  };

  async function saveName() {
    if (!name || !turma || !descricao) {
      alert("Por favor, preencha todos os campos.");
      return;
    }
    await AsyncStorage.setItem('@storage_Name', name);
    await AsyncStorage.setItem('@storage_Turma', turma);
    await AsyncStorage.setItem('@storage_Descricao', descricao);
  }

  useEffect(() => {
    (async () => {
      const NewName = await AsyncStorage.getItem('@storage_Name');
      setName(NewName);
      
      const NewTurma = await AsyncStorage.getItem('@storage_Turma');
      setTurma(NewTurma);

      const NewDescricao = await AsyncStorage.getItem('@storage_Descricao');
      setDescricao(NewDescricao);
      
      const Newimg = await AsyncStorage.getItem('@storage_img');
      if (Newimg == '') { alert("Carregar a Img denovo") } else { setImg(Newimg); }
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
          style={{ width: 120, height: 120, borderRadius: 60, borderWidth: 2, borderColor: theme.text }}
        />
      ) : null}

      <TextInput
        style={[styles.input, { color: theme.text, borderColor: theme.text, height: 50, width: 250 }]}
        placeholder="Alterar Nome de usuário"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={[styles.input, { color: theme.text, borderColor: theme.text, height: 50, width: 250 }]}
        placeholder="Alterar Turma do usuário"
        value={turma}
        onChangeText={setTurma}
      />
      <TextInput
        style={[styles.input, { color: theme.text, borderColor: theme.text, height: 50, width: 250 }]}
        placeholder="Alterar Descrição do usuário"
        value={descricao}
        onChangeText={setDescricao}
      />
      <NewButton onPress={saveName}>Salvar</NewButton>
      <NewButton onPress={() => navigation.navigate('Login')}> {"Sair"}</NewButton>
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
    width: '80%',
  },
});
