import React, { cloneElement } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NewButton } from '../components/componets'
import { FontAwesome, AntDesign } from '@expo/vector-icons';


export default function Home() {
  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', margin: 10 }}>Saldo: </Text>
      <Text style={{ fontSize: 24, fontWeight: 'bold', margin: 10 }}>Ticket: </Text>
      <View style={styles.row}>

        <View style={styles.collum}>
          <TouchableOpacity style={styles.button}>
            <FontAwesome name="dollar" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.text}>Carregar creditos</Text>
        </View>

        <View style={styles.collum}>
        <TouchableOpacity style={styles.button}>
          <AntDesign name="shop" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.text}>Comprar na cantina</Text>
        </View>
       

      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    flex: 1,
    backgroundColor: '#fff',
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
    backgroundColor: 'blue',
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: 'black',
    margin: 10,
    fontWeight: 'bold',

  }

});
