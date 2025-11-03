import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; 


export default function Transactions() {

  const [produto, setProduto] = useState([])

    useEffect(() => {
    (async () => {
      const newProduto = await AsyncStorage.getItem('produto');
      setProduto(JSON.parse(newProduto) || []);
    })();
  }, []);
  return (

   
    <View style={styles.container}>
       <FlatList
        data={produto}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
            <View style={{ padding: 10, borderWidth: 1, padding: 45, margin: 5, borderColor: 'black', height: 40, width: 300, textAlign: 'center', justifyContent: 'center', alignItems: 'center', }}>
            <Text style={{ borderBottomWidth: 1 }}>{item}</Text>
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
});
