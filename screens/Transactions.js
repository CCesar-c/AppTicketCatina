import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; 


export default function Transactions() {


  const [produtos, setProdutos] = useState([])
  const [precos, setPrecos] = useState([])


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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 18,
    color: 'black',
  }
});
