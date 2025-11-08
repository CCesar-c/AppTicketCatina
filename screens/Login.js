import { useContext, useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import { supabase } from '../Back-end/supabase';
import NewButton from '../components/componets';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeContext } from '../contexts/themeContext';


export default function Login({ navigation }) {
  const { theme } = useContext(ThemeContext);
  // ctr + fn + /
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')


  async function loadUsers() {
    if (!name || !email || !pass) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }
    const { data, error } = await supabase
      .from('users')
      .select('*')
    if (error) {
      console.log('❌ Error:', error.message);
    }
    else {
      console.log('✅ Data:', data);
    }

    if (email === data[1].Emails && pass === data[1].Senha) {
      //user normal
      navigation.navigate('Drawer')
      alert("Acceso para o Usuario")
    }
    else if (email === data[0].Emails && pass === data[0].Senha) {
      // Administrador
      navigation.navigate('AdminHome')
      alert("Acceso para o ADM")
    } else {
      alert("Usuario ou Senha Incorretos")
    }
  }

  async function storeData() {
    await AsyncStorage.setItem('@storage_Name', name)
  }

  async function loadData() {
    const name = await AsyncStorage.getItem('@storage_Name');
    setName(name);
  }

  if (!name)
    loadData();
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>Cadastro</Text>
      <TextInput
        style={[styles.input, { color: theme.text }]}
        placeholder='Digite Seu Nome'
        value={name || "Nome nao encontrado"}
        onChangeText={setName}
        keyboardType='default'
      />
      <TextInput
        style={[styles.input, { color: theme.text }]}
        placeholder='Digite Seu Email'
        value={email}
        onChangeText={setEmail}
        keyboardType='default'
      />
      <TextInput
        style={[styles.input, { color: theme.text }]}
        placeholder='Digite Sua Senha'
        value={pass}
        onChangeText={setPass}
        secureTextEntry
        keyboardType='numeric'
      />
      <NewButton children="Cadastrar" style={styles.butao} onPress={() => {
        loadUsers()
        storeData()
      }} />
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
