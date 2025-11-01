
import { StyleSheet, Text, View, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from 'react';
import NewButton from '../components/componets';

export default function Configs() {
  const [name, setName] = useState('')
  const [turma, setTurma] = useState('')

  async function saveName() {
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
      <TextInput placeholder="Nome de usuario" onChangeText={(text) => { setName(text) }} />
      <TextInput placeholder="Turma do usuario" onChangeText={(text) => { setTurma(text) }} />
      <NewButton onPress={saveName} activeOpacity={0.6}>Salvar</NewButton>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
