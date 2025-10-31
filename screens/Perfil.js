
import { StyleSheet, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from 'react';

export default function Perfil() {
  const [name, setName] = useState('')

  async function loadData() {
    const name = await AsyncStorage.getItem('@storage_Key');
    setName(name);
  }
  if (!name)
    loadData();
  return (
    <View style={styles.container}>

      <Text style={{
        fontSize: 24, fontWeight: 'bold', margin: 10, textAlign: 'left',
      }}>{name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
