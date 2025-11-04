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
    // const fetchFotos = async () => {
    //   // https://www.themealdb.com/api/json/v1/1/random.php
    //   // const res = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?f=b');
    //   // const json = await res.json();
    //   // setResult(json || []);
    //   for (let index = 0; index < 20; index++) {
    //     const res = await fetch(`https://www.themealdb.com/api/json/v1/1/random.php`);
    //     const json = await res.json();
    //     setResult((prevFotos) => {
    //       return [...prevFotos, ...(json.meals || [])]
    //     });
    //   }

    // };
    // fetchFotos();

    const fetchGeneral = async () => {
      const { data: img } = await supabase
        .storage
        .from("Imagens")
        .list()

      const { data: comidas } = await supabase
        .from('Comidas')
        .select('*');
      const { data: bebidas } = await supabase
        .from('Bebidas')
        .select('*');
      const { data: outros } = await supabase
        .from('Outras opcoes')
        .select('*');

      setResult([...(comidas || []), ...(bebidas || []), ...(outros || [])]);
    }
    fetchGeneral();
  }, 1);


  return (
    <View style={[{ height: '32.25%', backgroundColor: theme.background }]}>
        <ScrollView showsVerticalScrollIndicator={true} contentContainerStyle={styles.container}>
          {result.map((item, index) => {
            return (
              <View key={index} style={styles.card}>
                <Image
                  source={{ uri: "https://www.unileverfoodsolutions.com.mx/tendencias/de-mexico-para-el-mundo/platillos-mexicanos/top10-platillos/jcr:content/parsys/content-aside-footer/columncontrol_copy/columnctrl_parsys_1/textimage_copy/image.transform/jpeg-optimized/image.1592429867593.jpg" }}
                  style={styles.image}
                  resizeMode="cover"
                />
                <Text style={styles.text}>
                  🍽️ Nome: {item.Nome}{"\n"}
                  💰 Preço: {item.Valor + " contos"}
                </Text>
                <NewButton
                  style={{ width: '120px', height: '60px', backgroundColor: '#28a745', borderRadius: 5, marginTop: 10, }}
                  onPress={async () => {
                    navigation.navigate('DetalhesCompras', {
                      nombre: item.Nome,
                      Preco: item.Valor
                    });
                    
                    try {
                      // Carregar arrays existentes
                      const produtosAtuais = await AsyncStorage.getItem('produto');
                      const precosAtuais = await AsyncStorage.getItem('preco');
                      
                      // Converter para array ou criar novo se não existir
                      const arrayProdutos = produtosAtuais ? JSON.parse(produtosAtuais) : [];
                      const arrayPrecos = precosAtuais ? JSON.parse(precosAtuais) : [];
                      
                      // Adicionar novos itens
                      arrayProdutos.push(item.Nome);
                      arrayPrecos.push(item.Valor);
                      
                      // Salvar arrays atualizados
                      await AsyncStorage.setItem('produto', JSON.stringify(arrayProdutos));
                      await AsyncStorage.setItem('preco', JSON.stringify(arrayPrecos));
                      
                      alert(`Adicionado ${item.Nome} ao carrinho!`);
                    } catch (error) {
                      console.error('Erro ao salvar item:', error);
                      alert('Erro ao adicionar item ao carrinho');
                    }
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
        width: 150, height: 200, borderRadius: 10, marginBottom: 10
  },
      text: {
        fontSize: 16, fontWeight: 'bold', textAlign: 'center'
  },
});
