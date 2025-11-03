
import { StyleSheet, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from 'react';

export default function Perfil() {
  const [name, setName] = useState('')
  const [turma, setTurma] = useState('')

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

      <Text style={{
        fontSize: 24, fontWeight: 'bold', margin: 10, textAlign: 'left',
      }}>Nome: {name}</Text>
      <Text style={{
        fontSize: 24, fontWeight: 'bold', margin: 10, textAlign: 'left',
      }}>Turma: {turma}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
