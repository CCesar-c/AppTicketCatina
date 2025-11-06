
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import { supabase } from '../Back-end/supabase';

export default function AdminHome() {
  const [pordutos, setProdutos] = useState()
  useEffect(() => {
    const { data } = supabase.from("Comidas").select("*")
    setProdutos(data)
  })
  return (
    <View style={styles.container}>
      <Text>Tela do Admin</Text>
      <FlatList data={data} keyExtractor={(_, index) => index.toString()}
       renderItem={({ item }) => (
        <View style={[styles.itemContainer, { backgroundColor: theme.background }]}>
          <Text style={[styles.text, { color: theme.text }]}>Produto: {item.produto}</Text>
          <Text style={[styles.text, { color: theme.text }]}>Preço: R$ {item.preco}</Text>
          <Text style={[styles.text, { color: theme.text }]}>Preço: R$ {item.data}</Text>
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
