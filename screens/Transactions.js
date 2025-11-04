import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function Transactions() {


  const [produtos, setProdutos] = useState([])
  const [precos, setPrecos] = useState([])

  function Limpar() {
    setProdutos(['']);
    setPrecos(['']);
  }

  useEffect(() => {
    (async () => {
      const newProduto = await AsyncStorage.getItem('produto');
      setProdutos([...produtos, newProduto])
      const newPreco = await AsyncStorage.getItem('preco');
      setPrecos([...precos, newPreco])
    })();
  }, []);
  return (

    <View style={styles.container}>
      <Text style={styles.title}>Histórico</Text>
      <View style={styles.row}>
        <FlatList
          data={produtos}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.container}>
              <Text style={styles.text}>Produto: {item}</Text>
            </View>
          )} />
        <FlatList
          data={precos}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.container}>
              <Text style={styles.text}>Preço: {item}</Text>
            </View>
          )} />
      </View>
      <TouchableOpacity onPress={Limpar}>
        <Text>Limpar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  text: {
    fontSize: 18,
    color: 'black',
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 30,

  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  }
});
