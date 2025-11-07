import { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, Image, ScrollView } from 'react-native';
import { supabase } from '../Back-end/supabase';
import { ThemeContext } from '../contexts/themeContext';
import { createDrawerNavigator } from '@react-navigation/drawer';
import NewButton from '../components/componets';
import { TextInput } from 'react-native-web';
import * as ImagePicker from "expo-image-picker";

function AdminHome() {
  const { theme } = useContext(ThemeContext);
  const [result, setResult] = useState([]);
  const [fotos, setFotos] = useState([]);

  const tupdate = async (nombre, estado) => {
    // actualiza en todas las tablas
    await supabase.from('Comidas').update({ Disponivel: estado }).eq('Nome', nombre);
    await supabase.from('Bebidas').update({ Disponivel: estado }).eq('Nome', nombre);
    await supabase.from('Outras opcoes').update({ Disponivel: estado }).eq('Nome', nombre);
  };

  useEffect(() => {
    const fetchGeneral = async () => {
      const { data } = await supabase.storage.from('Imagens').list();
      const urls = data.map((file) => {
        const { data: publicUrl } = supabase.storage.from('Imagens').getPublicUrl(file.name);
        return { name: file.name, url: publicUrl.publicUrl };
      });
      setFotos(urls);

      const { data: comidas } = await supabase.from('Comidas').select('*');
      const { data: bebidas } = await supabase.from('Bebidas').select('*');
      const { data: outros } = await supabase.from('Outras opcoes').select('*');

      setResult([...(comidas || []), ...(bebidas || []), ...(outros || [])]);
    };
    fetchGeneral();
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
    <View style={[{ height: '100%', backgroundColor: theme.background }]}>
      <ScrollView showsVerticalScrollIndicator={true} contentContainerStyle={styles.container}>
        <Text style={{ color: theme.text }}>Tela do Admin</Text>
        <FlatList
          data={result}
          keyExtractor={(_, index) => index.toString()}
          numColumns={6}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Image
                source={{ uri: fotos.find((i) => i.name.includes(item.Nome))?.url }}
                style={styles.image}
                resizeMode="contain"
              />
              <Text style={styles.text}>
                🍽️ Nome: {item.Nome}{"\n"}
                💰 Preço: {item.Valor} R$
              </Text>

              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ color: theme.text }}>Aparece para o usuário: </Text>
                <NewButton onPress={() => handleToggle(item)}>
                  {item.Disponivel ? "✅" : "❌"}
                </NewButton>
              </View>
            </View>
          )
          }
        />
      </ScrollView>
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

    const { data, error } = await supabase.storage
      .from("Imagens")
      .upload(fileName, blob, {
        contentType: 'image/jpeg',
        upsert: true
      });

    if (error) {
      console.error(error);
      return;
    }

    // // Obter URL pública
    // const { data: publicData } = supabase.storage
    //   .from("Imagens")
    //   .getPublicUrl(fileName);

    // const imageUrl = publicData.publicUrl;
    // console.log("✅ URL pública:", imageUrl);
    // return imageUrl;
  }
  return (
    <View style={[{ backgroundColor: theme.background, alignItems: 'center', justifyContent: 'center', flex: 1, gap: 20 }]} >
      <Text style={[{ color: theme.text, fontSize: 30, marginBottom: 40 }]} >Adicionar uma nova comidas</Text>

      <View style={{ flexDirection: 'row', gap: 20 }} >
        <TextInput placeholder='Nome da comida' style={{ borderColor: 'black', borderWidth: 1, borderRadius: 10 }} onChangeText={setNome} />
        <TextInput placeholder='Valor da comida em R$' style={{ borderColor: 'black', borderWidth: 1, borderRadius: 10 }} onChangeText={setValor} />
        <NewButton children={`Disponivel?: ${checked ? '✅' : '❌'} `} onPress={() => {
          setChecked(!checked)
        }} />
        <NewButton children={'Inserir Imagen para a comida'} onPress={() => {
          pickImage();
        }} />
      </View>
      <Image source={{ uri: getImg }} style={{ height: 200, width: 200 }} />
      <NewButton children={"Salvar e adicionar"} onPress={async () => {
        if (!getNome || !getValor || !getImg) {
          alert("Porfavor Preencha os campos requeridos...")
          return;
        }
        await uploadImage()
        await supabase.from("Comidas").upsert([
          { Nome: getNome, Valor: getValor, Creditos: getValor * 1000, Disponivel: checked },
        ])
      }} />
    </View >
  )
}

export default function RouterAdmin() {

  const Tab = createDrawerNavigator();
  return (
    <Tab.Navigator initialRouteName='homeAdm'>
      <Tab.Screen name='homeAdm' component={AdminHome} />
      <Tab.Screen name='CreateNewFood' component={CreateNewFood} />
    </Tab.Navigator>
  )

}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
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
