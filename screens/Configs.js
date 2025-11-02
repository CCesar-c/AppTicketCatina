
import { StyleSheet, Text, View, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from 'react';
import NewButton from '../components/componets';

export default function Configs() {
  const [name, setName] = useState('')
  const [turma, setTurma] = useState('')

  async function saveName() {
    if (!name || !turma) {
      alert("Por favor, preencha todos os campos.");
      return;
    }
    await AsyncStorage.setItem('@storage_Key', name);
    await AsyncStorage.setItem('@storage_Turma', turma);
  }
  useEffect(() => {
    (async () => {
      const NewName = await AsyncStorage.getItem('@storage_Key');
      setName(NewName);
      const NewTurma = await AsyncStorage.getItem('@storage_Turma');
      setTurma(NewTurma);
    })();
  }, []);
  return (
    <View style={styles.container}>
      <Text>Configurações</Text>
      <TextInput
        style={{ borderColor: "black", borderWidth: 1, borderRadius: 10, padding: 10 }}
        placeholder="Alterar Nome de usuario"
        onChangeText={(text) => { setName(text) }} />
      <TextInput
        style={{ borderColor: "black", borderWidth: 1, padding: 10, borderRadius: 10 }}
        placeholder="Alterar Turma do usuario"
        onChangeText={(text) => { setTurma(text) }} />
      <NewButton onPress={saveName} activeOpacity={0.6} style={{ paddingVertical: 10, paddingHorizontal: 30, backgroundColor: 'white', borderRadius: 10, borderColor: "black", borderWidth: 1 }} >Salvar</NewButton>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
