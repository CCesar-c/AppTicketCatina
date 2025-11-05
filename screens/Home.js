import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useState, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NewButton } from '../components/componets'
import { FontAwesome, AntDesign } from '@expo/vector-icons';
import { ThemeContext } from '../contexts/themeContext';

export default function Home({ navigation }) {
  const { theme } = useContext(ThemeContext);


  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={{ fontSize: 24, margin: 10, color: theme.text }}>Ticket: </Text>
      <View style={styles.row}>

        <View style={styles.collum}>
          <NewButton style={styles.button} onPress={() => { navigation.navigate('Creditos') }}>
            <FontAwesome name="dollar" size={24} color={`${theme.colorIcon}`} />
          </NewButton>
          <Text style={[styles.text, { color: theme.buttonText }]}>Carregar creditos</Text>
        </View>

        <View style={styles.collum}>
          <NewButton style={styles.button} onPress={() => navigation.navigate('Cardapio')}>
            <AntDesign name="shop" size={24} color={`${theme.colorIcon}`} />
          </NewButton>
          <Text style={[styles.text, { color: theme.buttonText }]}>Comprar na cantina</Text>
        </View>
      </View>
    </View >
  );
}


const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    flex: 1,
    alignItems: 'flex-start',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 30,

  },
  collum: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  button: {
    height: 50,
    width: 50,
    borderRadius: 50,
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    margin: 10,
    fontWeight: 'bold',
  }

});
