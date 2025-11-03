import { useEffect, useState, useContext } from 'react';
import { StyleSheet, Text, View, Image, ScrollView } from 'react-native';
import { supabase } from '../Back-end/supabase';
import NewButton from '../components/componets';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeContext } from '../contexts/themeContext';

export default function Cardapio({ navigation }) {

  const { theme } = useContext(ThemeContext);
  const [result, setResult] = useState([]);
  const [fotos, setFotos] = useState([]);

  useEffect(() => {
    // const fetchFotos = async () => {
    //   // const res = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?f=b');
    //   // const json = await res.json();
    //   // setFotos(json.meals || []);
    //   for (let index = 0; index < 30; index++) {
    //     const res = await fetch(`https://www.themealdb.com/api/json/v1/1/random.php`);
    //     const json = await res.json();
    //     setFotos((prevFotos) => {
    //       return [...prevFotos, ...(json.meals || [])]
    //     });
    //   }

    // };
    // fetchFotos();

    const fetchGeneral = async () => {
      const { data: comidas } = await supabase
        .from('Comidas')
        .select('*');
      const { data: files } = await supabase
        .storage
        .from('Imagens')
        .list();
      const url = files.map((file) => {
        const { data: singleImage } = supabase
          .storage
          .from('Imagens')
          .getPublicUrl(file.name);
        return { name: file.name, publicUrl: singleImage.publicUrl };
      });
      setFotos(url || []);
      setResult(comidas || []);
    }
    fetchGeneral();
  }, []);

  return (
    <View style={[{ height: '80%', backgroundColor: theme.background }]}>
      <ScrollView showsVerticalScrollIndicator={true} contentContainerStyle={styles.container}>
        {result.map((item, index) => (
          <View key={item.id} style={styles.card}>
            <Image
              resizeMode='contain'
              source={{ uri: fotos.find((foto) => foto.name === item.Nome + ".jpeg")?.publicUrl }}
              style={styles.image}
            />
            <Text style={styles.text}>
              🍽️ Nome: {item.Nome}{"\n"}
              💰 Preço: {item.Valor + " contos"}
            </Text>
            <NewButton
              style={{ width: '120px', height: '60px', backgroundColor: '#28a745', borderRadius: 5, marginTop: 10, }}
              onPress={async () => {
                const fotoFind = fotos.find((foto) => foto.name === item.Nome + ".jpeg")?.publicUrl
                navigation.navigate('DetalhesCompras', {
                  nombre: item.Nome,
                  valor: item.Valor ,
                  fotoproduto: fotoFind,
                }); alert(`Adicionado ${item.Nome} ao carrinho!`); await AsyncStorage.setItem("carrinho", item.Nome)
              }}>
              {"Adicionar ao Carrinho"}
            </NewButton>
          </View>
        ))
        }
      </ScrollView >
    </View >
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    paddingVertical: 10,

  },
  card: {
    width: '200px',
    marginBottom: 15,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%', height: 200, borderRadius: 10, marginBottom: 10
  },
  text: {
    fontSize: 16, fontWeight: 'bold', textAlign: 'center'
  },
});
