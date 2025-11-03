import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; 


export default function Transactions() {

  const [produto, setProduto] = useState([])

    useEffect(() => {
    (async () => {
      const newProduto = await AsyncStorage.getItem('produto');
      setProduto(JSON.parse(newProduto) || ['Nenhum produto encontrado']);
    })();
  }, []);
  return (

   
    <View style={styles.container}>
       <FlatList
        data={produto}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
            <View style={styles.container}>
            <Text style={styles.text}>{item} oi</Text>
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
