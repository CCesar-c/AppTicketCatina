import { useContext, useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Alert } from 'react-native';
import { supabase } from '../Back-end/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NewButton from '../components/componets';
import { ThemeContext } from '../contexts/themeContext';

export default function Login({ navigation }) {
  const { theme } = useContext(ThemeContext);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');

  // 🔹 Carga nombre guardado en AsyncStorage al iniciar
  useEffect(() => {
    async function loadData() {
      const storedName = await AsyncStorage.getItem('@storage_Name');
      if (storedName) setName(storedName);
    }
    loadData();
  }, []);

  // 🔹 Guarda el nombre actual
  async function storeData() {
    if (name) await AsyncStorage.setItem('@storage_Name', name);
  }

  // 🔹 Verifica usuario en Supabase
  async function loadUsers() {
    if (!name || !email || !pass) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('Emails', email)
      .eq('Senha', pass);

    if (error) {
      console.log('❌ Error:', error.message);
      alert('Erro', 'Erro ao buscar usuário.');
      return;
    }

    if (!data || data.length === 0) {
      alert('Erro', 'Usuário não encontrado.');
      return;
    }

    if (data[0].Administrador === true) {
      navigation.navigate('RouterAdmin');
      alert('Acesso concedido ' + 'Bem-vindo administrador!');
    } else if (data[0].Administrador === false) {
      navigation.navigate('Drawer');
      alert('Acesso concedido ' + 'Bem-vindo usuário!');
    } else {
      console.error("Erro de autorizaçao")
    }

    storeData();
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>Login</Text>

      <TextInput
        style={[styles.input, { color: theme.text }]}
        placeholder="Digite Seu Nome"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={[styles.input, { color: theme.text }]}
        placeholder="Digite Seu Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={[styles.input, { color: theme.text }]}
        placeholder="Digite Sua Senha"
        value={pass}
        onChangeText={setPass}
        secureTextEntry
      />

      <NewButton onPress={loadUsers}>Entrar</NewButton>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    height: 40,
    width: 250,
    margin: 10,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    borderColor: 'gray',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});
