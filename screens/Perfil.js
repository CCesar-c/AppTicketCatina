
import { StyleSheet, Text, View, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect, useContext } from 'react';
import { ThemeContext } from '../contexts/themeContext';

export default function Perfil() {
  const { theme } = useContext(ThemeContext);
  const [name, setName] = useState('')
  const [turma, setTurma] = useState('')
  const [descricao, setDescricao] = useState('')
  const [imgGet, setImg] = useState('')

  useEffect(() => {
    (async () => {
      const NewName = await AsyncStorage.getItem('@storage_Name');
      setName(NewName);
      const NewTurma = await AsyncStorage.getItem('@storage_Turma');
      setTurma(NewTurma);
      const NewDescricao = await AsyncStorage.getItem('@storage_Descricao');
      setDescricao(NewDescricao);
      const Newimg = await AsyncStorage.getItem('@storage_img');
      console.log(Newimg)
      setImg(Newimg)
    })();
  }, []);
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Image
        source={{ uri: imgGet}} style={{ width: 150, height: 150, borderRadius: 75, borderWidth: 2, borderColor: theme.text }} />
      <Text style={[{ fontSize: 24, fontWeight: 'bold', margin: 10, textAlign: 'left', color: theme.text }]}>Nome: {name} . ⬅️</Text>
      <Text style={[{ fontSize: 24, fontWeight: 'bold', margin: 10, textAlign: 'left', color: theme.text }]}>Turma: {turma} . ⬅️</Text>
      <Text style={[{ fontSize: 24, fontWeight: 'bold', margin: 10, textAlign: 'left', color: theme.text }]}>Descrição: {descricao}  ⬅️</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center'
  },
});
