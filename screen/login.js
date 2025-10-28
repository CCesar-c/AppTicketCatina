
import { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

export default function Login() {

const [name, setName] = useState('')
const [email, setEmail] = useState('')
const [pass, setPass] = useState('')

  return (
    <View style={styles.container}>
        <Text style={styles.title}>Cadastro</Text>
       <TextInput
        style={styles.input}
        placeholder='Digite Seu Nome'
        value={name}
        onChangeText={setName}
        keyboardType='default'
      />
           <TextInput
        style={styles.input}
        placeholder='Digite Seu Email'
        value={email}
        onChangeText={setEmail}
        keyboardType='default'
      />
           <TextInput
        style={styles.input}
        placeholder='Digite Sua Senha'
        value={pass}
        onChangeText={setPass}
        keyboardType='numeric'
      />
       <TouchableOpacity style={styles.butao}>
        <Text style={styles.text}>Cadastrar</Text>
       </TouchableOpacity>
    
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
  input: {
    height: 40,
    width: 200,
    margin: 10,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 5,
    paddingLeft: 10,
  },
  butao: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    margin: 10,
    borderWidth: 1, 
    borderColor: 'black', 
    borderRadius: 5,
  },
  text: {
    color: 'black',
  },
   title: {
    color: 'black',
    fontSize: 30,
    fontWeight: 'bold',
  },
});