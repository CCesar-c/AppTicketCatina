import { useContext, useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TextInput, Alert, Image } from 'react-native';
import { supabase } from '../Back-end/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NewButton from '../components/componets';
import { ThemeContext } from '../contexts/themeContext';
import * as Animatable from 'react-native-animatable';
import Logo from '../assets/Cantina_Tickect_ja.png'

export default function Login({ navigation }) {
  const { theme } = useContext(ThemeContext);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [dataId, setDataid] = useState(0)
  const ref = useRef(null)

  useEffect(() => {

    const obtenerId = async () => {
      const { data, error } = await supabase.from("users").select("id").eq("Emails", email)
      setDataid(data);

      if (error)
        console.log(error);
    }

    async function loadData() {
      const storedName = await AsyncStorage.getItem(`@storage_Name`);

      if (storedName) setName(storedName);
    }
    loadData();
    obtenerId();
  }, []);

  async function storeData() {
    if (name) await AsyncStorage.setItem(`@storage_Name`, name);
    await AsyncStorage.setItem("Email", email);
  }

  async function loadUsers() {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('Senha', pass)
      .eq('Emails', email) || eq('Matriculas', email);
    if (error) {
      console.log('❌ Error:', error.message);
      alert('Erro ao buscar usuário.');
      return;
    }

    if (!data || data.length === 0) {
      ref.current.shake(200)
      alert('Usuário não encontrado.');
      return;
    } else if (!name || !email || !pass) {
      ref.current.shake(200)
      alert("Preencha os campos requeridos..!!")
    }

    if (data[0].Administrador === true) {
      navigation.navigate('RouterAdmin');
      alert('Acesso concedido ' + 'Bem-vindo administrador!');
      ref.current.fadeOut(200)
    } else if (data[0].Administrador === false) {
      navigation.navigate('Drawer');
      alert('Acesso concedido ' + 'Bem-vindo usuário!');
      ref.current.fadeOut(200)
    } else {
      console.error("Erro de autorizaçao")
      ref.current.shake(200)
    }
    storeData();

  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Animatable.View animation={'fadeInUp'} ref={ref} style={[styles.container, { backgroundColor: theme.background }]}>
        <Image
          source={Logo}
          style={{ width: 150, height: 200 }}>
        </Image>
        <Text style={[styles.title, { color: theme.text }]}>Login</Text>

        <TextInput
          style={[styles.input, { color: theme.text }]}
          placeholder="Digite Seu Nome"
          value={name}
          onChangeText={setName}
          keyboardType="default"
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
          keyboardType="default"
        />

        <NewButton onPress={() => {
          loadUsers()
        }}>Entrar</NewButton>
      </Animatable.View>
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
