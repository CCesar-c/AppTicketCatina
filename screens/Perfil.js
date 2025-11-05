
import { StyleSheet, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect, useContext } from 'react';
import { ThemeContext } from '../contexts/themeContext';

export default function Perfil() {
  const { theme } = useContext(ThemeContext);
  const [name, setName] = useState('')
  const [turma, setTurma] = useState('')

  useEffect(() => {
    (async () => {
      const NewName = await AsyncStorage.getItem('@storage_Name');
      setName(NewName);
      const NewTurma = await AsyncStorage.getItem('@storage_Turma');
      setTurma(NewTurma);
    })();
  }, []);
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>

      <Text style={[{ fontSize: 24, fontWeight: 'bold', margin: 10, textAlign: 'left', color: theme.text }]}>Nome: {name}</Text>
      <Text style={[{ fontSize: 24, fontWeight: 'bold', margin: 10, textAlign: 'left', color: theme.text }]}>Turma: {turma}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
