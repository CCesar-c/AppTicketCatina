import React, { useEffect, useState, useContext } from 'react';
import { ThemeContext } from '../contexts/themeContext';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NewButton from '../components/componets';


export default function Transactions() {
  const { theme } = useContext(ThemeContext);
  const [produtos, setProdutos] = useState([])
  // const [precos, setPrecos] = useState([])

  // const carregarHistorico = async () => {
  //   try {
  //     const produtosStorage = await AsyncStorage.getItem('produto');
  //     const precosStorage = await AsyncStorage.getItem('preco');

  //     if (produtosStorage) {
  //       setProdutos(JSON.parse(produtosStorage));
  //     }
  //     if (precosStorage) {
  //       setPrecos(JSON.parse(precosStorage));
  //     }
  //   } catch (error) {
  //     console.error('Erro ao carregar histórico:', error);
  //   }
  // };

  // function Limpar() {
  //   AsyncStorage.removeItem('produto');
  //   AsyncStorage.removeItem('preco');
  //   setProdutos([]);
  //   setPrecos([]);
  // }

  useEffect(() => {
    const carregarProdutos = async () => {
      try {
        const res = await AsyncStorage.getItem('produto');
        if (res) {
          setProdutos(JSON.parse(res));
        } else {
          setProdutos([]);
        }
      } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        setProdutos([]);
      }
    };
    carregarProdutos();
  }, []);
  return (

    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[{ color: theme.text }]}>Histórico</Text>
      {produtos.map((item, index) => {
        return (
          <View key={index} style={styles.itemContainer}>
            <Text style={styles.text}>Produto: {item.nombre}</Text>
            <Text style={styles.text}>Preço: R$ {item.Valor}</Text>
          </View>
        )
      })}
      {/* <FlatList
        data={produtos.map((produto, index) => ({
          produto: produto,
          preco: precos[index]
        }))}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Text style={styles.text}>Produto: {item.produto}</Text>
            <Text style={styles.text}>Preço: R$ {item.preco}</Text>
          </View>
        )}
      /> */}
      <NewButton children={"limpar"} onPress={() => {
        Limpar()
      }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',

  },
  itemContainer: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    marginVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#dee2e6',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  text: {
    fontSize: 16,
    color: 'black',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  butao: {
    alignItems: 'center',
    width: 100,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    margin: 10,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 5,
  },
});

// historico feito