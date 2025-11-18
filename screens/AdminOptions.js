import { useContext, useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, Image, ScrollView, TextInput } from 'react-native';
import { supabase } from '../Back-end/supabase';
import { ThemeContext } from '../contexts/themeContext';
import { createDrawerNavigator } from '@react-navigation/drawer';
import NewButton from '../components/componets';
import { FontAwesome, AntDesign } from '@expo/vector-icons';
import * as ImagePicker from "expo-image-picker";
import { FoodContext, FoodProvider } from '../contexts/ContextFoodSB';
import ThemeProvider from '../contexts/themeContext';
import Configs from './Configs';
import Perfil from './Perfil';

function AdminHome() {
  const { theme } = useContext(ThemeContext);
  const [result, setResult] = useState([]);
  const [fotos, setFotos] = useState([]);
  // const [comidas, setComidas] = useState([]);
  // const [bebidas, setBebidas] = useState([]);
  // const [outros, setOutros] = useState([]);

  const tupdate = async (nombre, estado) => {
    try {
      await Promise.all([
        supabase.from('Comidas').update({ Disponivel: estado }).eq('Nome', nombre),
        supabase.from('Bebidas').update({ Disponivel: estado }).eq('Nome', nombre),
        supabase.from('Outras opcoes').update({ Disponivel: estado }).eq('Nome', nombre),
      ]);
    } catch (err) {
      console.error('Erro ao atualizar estado:', err);
    }
  };

  useEffect(() => {
    const foodall = async () => {
      try {
        const [
          { data: comiData },
          { data: bebiData },
          { data: outrosData },
          { data: files }
        ] = await Promise.all([
          supabase.from('Comidas').select('*'),
          supabase.from('Bebidas').select('*'),
          supabase.from('Outras opcoes').select('*'),
          supabase.storage.from("Imagens").list(),
        ]);

        const cadaFoto = files.map(file => {
          const { data: publicUrl } = supabase.storage
            .from("Imagens")
            .getPublicUrl(file.name);

          return {
            name: file.name.toLowerCase(),
            url: publicUrl.publicUrl
          };
        });

        // setComidas(comiData);
        // setBebidas(bebiData);
        // setOutros(outrosData);
        setFotos(cadaFoto);

        setResult([...comiData, ...bebiData, ...outrosData]);

      } catch (error) {
        console.error("ERROR AL OBTENER LOS VALORES:\n", error);
      }
    };

    foodall();
    const interval = setInterval(foodall, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleToggle = async (item) => {
    const nuevoEstado = !item.Disponivel;

    // Actualizar en la base de datos
    await tupdate(item.Nome, nuevoEstado);

    // Actualizar en el estado local
    setResult((prev) =>
      prev.map((i) =>
        i.Nome === item.Nome ? { ...i, Disponivel: nuevoEstado } : i
      )
    );
  };

  return (
    <View style={[{ height: '100%', backgroundColor: theme.background, justifyContent: 'center', alignItems: 'center' }]}>
      <Text style={[styles.text, { color: theme.text, fontSize: 30, fontWeight: 'bold' }]}>Tela do Admin</Text>
      <ScrollView showsVerticalScrollIndicator={true} contentContainerStyle={[styles.container, { backgroundColor: theme.background }]}>
        {result.map((item, index) => {
          return (
            <View key={index} style={[styles.card, { backgroundColor: theme.buttonBackground, margin: 3 }]}>
              <Image
                source={{
                  uri: fotos.find(i =>
                    i.name.includes(item.Nome.toLowerCase())
                  )?.url
                }}
                style={styles.image}
                resizeMode="contain"
              />
              <Text style={[styles.text, { color: theme.text }]}>
                🍽️ Nome: {item.Nome}{"\n"}
                💰 Preço: {item.Valor} R$
              </Text>

              <View style={[{ flexDirection: 'row', alignItems: 'center' }]}>
                <NewButton style={{ height: 40, width: 40 }} onPress={() => handleToggle(item)}>
                  {item.Disponivel ? "✅" : "❌"}
                </NewButton>
              </View>
            </View>
          )
        })}
      </ScrollView >
    </View >
  );
}

function CreateNewFood() {
  const { theme } = useContext(ThemeContext);
  const [checked, setChecked] = useState(true)
  const [getNome, setNome] = useState();
  const [getValor, setValor] = useState()
  const [getImg, setImg] = useState()

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert("Permissão para acessar a galeria é necessária!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setImg(uri);
    }
  };

  async function uploadImage() {
    if (!getImg) {
      alert("Selecione uma imagem primeiro!");
      return;
    }

    const response = await fetch(getImg);
    const blob = await response.blob();
    const fileName = `${getNome}.jpg`;

    const { data, error } = await supabase
      .storage
      .from("Imagens")
      .upload(fileName, blob, {
        contentType: 'image/jpeg',
        upsert: true
      });

    if (error) {
      console.error(error);
      return;
    }
  }
  return (
    <View style={[{ backgroundColor: theme.background, alignItems: 'center', justifyContent: 'center', flex: 1, gap: 20 }]} >
      <Text style={[{ color: theme.text, fontSize: 30, fontWeight: 'bold', }]} >Adicionar uma nova comidas</Text>

      <View style={{ flexDirection: 'column', gap: 20, alignItems: 'center' }} >
        <TextInput placeholder='Nome da comida' style={[{ backgroundColor: theme.buttonBackground, color: 'white', padding: 10, borderRadius: 10 }]} onChangeText={setNome} />
        <TextInput placeholder='Valor da comida em R$' style={[{ backgroundColor: theme.buttonBackground, color: 'white', padding: 10, borderRadius: 10 }]} onChangeText={setValor} />
        <NewButton children={`Disponivel?: ${checked ? '✅' : '❌'} `} onPress={() => {
          setChecked(!checked)
        }} />
        <NewButton children={'Inserir Imagen para a comida'} style={[{ color: theme.text }]}
          onPress={() => {
            pickImage();
          }} />
      </View>
      <Image source={{ uri: getImg }} style={{ height: 200 || 0, width: 200 || 0 }} />
      <NewButton children={"Salvar e adicionar"} onPress={async () => {
        if (!getNome || !getValor || !getImg) {
          alert("Porfavor Preencha os campos requeridos...")
          return;
        }
        await uploadImage()
        await supabase.from("Comidas").upsert([
          { Nome: getNome, Valor: getValor, Disponivel: checked },
        ])
      }} />
    </View >
  )
}
function AdicionarUser() {
  const { theme } = useContext(ThemeContext);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('');
  const [checked, setChecked] = useState(false);
  return (
    <View style={[styles.container, { backgroundColor: theme.background, color: theme.text , gap: 20, flexDirection: 'column', justifyContent: 'center', flex: 1, alignItems: 'center', flexWrap: 'nowrap' }]} >
      <Text style={[styles.text, { color: theme.text, fontSize: 30, fontWeight: 'bold', }]} >Adicionar Novo usuario </Text>
      <TextInput placeholder='Nome do novo usuario' onChangeText={setNome} style={[{ backgroundColor: theme.buttonBackground, color: 'white', padding: 10, borderRadius: 10 }]} />
      <TextInput placeholder='Email do novo usuario' onChangeText={setEmail} style={[{ backgroundColor: theme.buttonBackground, color: 'white', padding: 10, borderRadius: 10 }]} />
      <TextInput placeholder='Senha do novo usuario' onChangeText={setSenha} style={[{ backgroundColor: theme.buttonBackground, color: 'white', padding: 10, borderRadius: 10,  }]} />
      <NewButton style={[{color: theme.text}]} children={`Administrador?: ${checked ? '✅' : '❌'} `} onPress={() => {
        setChecked(!checked)
      }} />
      <NewButton onPress={async () => {
        if (!nome || !email || !senha) {
          alert("Preencha os campos")
          return;
        }
        try {
          await supabase.from("users").insert([
            { Users: nome, Emails: email, Senha: senha, Administrador: checked }
          ])
        } catch (error) {
          console.log("Error: " + error)
        }
          setNome('')
          setEmail('')
          setSenha('')
          alert("Usuario criado com sucesso");
      }} >
        {"Criar usuario"}
      </NewButton>
    </View>
  )
}

export default function RouterAdmin() {
  const { theme } = useContext(ThemeContext);
  const Tab = createDrawerNavigator();
  return (
    <FoodProvider >
  
        <Tab.Navigator initialRouteName='Comidas'
          screenOptions={{
            headerStyle: { backgroundColor: theme.background },
            headerTintColor: theme.text,
            drawerStyle: { backgroundColor: theme.background },
            drawerActiveTintColor: theme.text,
            drawerInactiveTintColor: theme.text,
          }}
        >
          <Tab.Screen name='Comidas' component={AdminHome} />
          <Tab.Screen name='Nova Comida' component={CreateNewFood} />
          <Tab.Screen name='Adicionar User' component={AdicionarUser} />
          <Tab.Screen name='Perfil' component={Perfil} />
          <Tab.Screen name='Configurações' component={Configs} />
        </Tab.Navigator>

    </FoodProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20
  },

  card: {
    width: 200,
    marginBottom: 15,
    padding: 10,
    borderRadius: 10,
    backgroundColor: 'aliceblue',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 150,
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',

    textAlign: 'center',
  },
});
