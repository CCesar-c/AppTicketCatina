import { useEffect, useState, useContext } from 'react';
import { StyleSheet, Text, View, Image, ScrollView } from 'react-native';
import { supabase } from '../Back-end/supabase';
import NewButton from '../components/componets';
import { ThemeContext } from '../contexts/themeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Cardapio({ navigation }) {

  const { theme } = useContext(ThemeContext);
  const [result, setResult] = useState([]);
  const [fotos, setFotos] = useState([]);
  const [guardar, setGuardar] = useState([])
  useEffect(() => {
    const fetchGeneral = async () => {
      const { data } = await supabase
        .storage
        .from("Imagens")
        .list();
      const urls = data.map((file) => {
        const { data: publicUrl } = supabase.storage
          .from("Imagens")
          .getPublicUrl(file.name);
        return { name: file.name, url: publicUrl.publicUrl };
      });
      setFotos(urls)
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
  }, []);


  return (
    <View style={[{ height: '32.125%', backgroundColor: theme.background }]}>
      <ScrollView showsVerticalScrollIndicator={true} contentContainerStyle={styles.container}>
        {result.map((item, index) => {
          return (
            <View key={index} style={styles.card}>
              <Image
                source={{ uri: fotos.find((i) => i.name.includes(item.Nome))?.url }}
                style={styles.image}
                resizeMode='contain'
              />
              <Text style={styles.text}>
                🍽️ Nome: {item.Nome}{"\n"}
                💰 Preço: {item.Valor + " R$"}
              </Text>
              <View style={{ flexDirection:'row' }} >
                <NewButton style={{ width: 100, height: 60, backgroundColor: '#28a745', borderRadius: 5 }}
                  onPress={async () => {
                    try {
                      //Carregar arrays existentes
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
                      console.error('Erro ao salvar item:' + error);
                      alert('Erro ao adicionar item ao carrinho');
                    }
                  }}>{"Comprar este produto"}
                </NewButton>
                <NewButton
                  style={{ width: 100, height: 60, backgroundColor: '#28a745', borderRadius: 5 }}
                  onPress={() => {
                    navigation.navigate('DetalhesCompras', {
                      nombre: item.Nome,
                      Valor: item.Valor,
                      img: fotos.find((i) => i.name.includes(item.Nome))?.url
                    });
                  }}>
                  {"Detalhes do produto"}
                </NewButton>
              </View>
            </View>
          )
        })
        }
      </ScrollView >
    </View >
  )
};

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
