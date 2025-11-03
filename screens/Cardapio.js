import { useEffect, useState, useContext } from 'react';
import { StyleSheet, Text, View, Image, ScrollView } from 'react-native';
import { supabase } from '../Back-end/supabase';
import NewButton from '../components/componets';
import { ThemeContext } from '../contexts/themeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Cardapio({ navigation }) {

  const { theme } = useContext(ThemeContext);
  const [result, setResult] = useState([]);

  useEffect(() => {
    const fetchFotos = async () => {
      // https://www.themealdb.com/api/json/v1/1/random.php
      // const res = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?f=b');
      // const json = await res.json();
      // setResult(json || []);
      for (let index = 0; index < 20; index++) {
        const res = await fetch(`https://www.themealdb.com/api/json/v1/1/random.php`);
        const json = await res.json();
        setResult((prevFotos) => {
          return [...prevFotos, ...(json.meals || [])]
        });
      }

    };
    fetchFotos();

    // const fetchGeneral = async () => {
    //   const { data: comidas } = await supabase
    //     .from('Comidas')
    //     .select('*');
    //   const { data: bebidas } = await supabase
    //     .from('Bebidas')
    //     .select('*');
    //   const { data: outros } = await supabase
    //     .from('Outras opcoes')
    //     .select('*');

    //   setResult([...(comidas || []), ...(bebidas || []), ...(outros || [])]);
    // }
    // fetchGeneral();
  },  1);

  return (
    <View style={[{ height: '85%', backgroundColor: theme.background }]}>
      <ScrollView showsVerticalScrollIndicator={true} contentContainerStyle={styles.container}>
        {result.map((item, index) => {
          return (
            <View key={index} style={styles.card}>
              <Image
                source={{uri: item.strMealThumb }}
                style={styles.image}
                resizeMode="cover"
              />
              <Text style={styles.text}>
                🍽️ Nome: {item.strMeal}{"\n"}
                {/* 💰 Preço: {item.Valor + " contos"} */}
              </Text>
              <NewButton
                style={{ width: '120px', height: '60px', backgroundColor: '#28a745', borderRadius: 5, marginTop: 10, }}
                onPress={async () => {
                  navigation.navigate('DetalhesCompras', {
                    nombre: item.Nome,
                    valor: item.Valor,
                    fotoproduto: foto,
                  }); alert(`Adicionado ${item.Nome} ao carrinho!`); await AsyncStorage.setItem("carrinho", item.Nome)
                }}>
                {"Adicionar ao Carrinho"}
              </NewButton>
            </View>
          )
        })
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
    backgroundColor: 'aliceblue',
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
