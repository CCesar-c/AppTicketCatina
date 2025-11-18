import React, { useEffect, useState, useContext } from 'react';
import { ThemeContext } from '../contexts/themeContext';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NewButton from '../components/componets';
import * as Animatable from 'react-native-animatable';

export default function Transactions() {
  const { theme } = useContext(ThemeContext);
  const [produtos, setProdutos] = useState([])
  const [precos, setPrecos] = useState([])
  const [historico, setHistorico] = useState([])
  const [_, setTime] = useState(0);

  const carregarHistorico = async () => {
    try {
      const historicoStorage = await AsyncStorage.getItem('historico');
      if (historicoStorage) {
        setHistorico(JSON.parse(historicoStorage));
      } else {
        setHistorico([]);
      }
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
    }
  };

  function Limpar() {
    AsyncStorage.removeItem('produto');
    AsyncStorage.removeItem('preco');
    AsyncStorage.removeItem('data')
    setProdutos([]);
    setPrecos([]);
    setdata([])
  }
  useEffect(() => {
    carregarHistorico();
    const interval = setInterval(() => {
      setTime(prev => prev + 1);
      carregarHistorico();
    }, 5000);
    return () => {
      clearInterval(interval);
    }
  }, [])
  return (
    <Animatable.View animation="fadeInLeft" style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={[styles.title, { color: theme.text }]}>Histórico</Text>
        <FlatList
          data={historico}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={[styles.itemContainer, { backgroundColor: theme.background }]}>
              <Text style={[styles.text, { color: theme.text }]}>Produto: {item.produto}</Text>
              <Text style={[styles.text, { color: theme.text }]}>Preço: R$ {item.preco}</Text>
              <Text style={[styles.text, { color: theme.text }]}>Horario: {item.data}</Text>
            </View>
          )} />
        <NewButton children={"Limpar"} onPress={() => {
          Limpar()
        }} />
      </View>
    </Animatable.View>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    height: '100%',
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