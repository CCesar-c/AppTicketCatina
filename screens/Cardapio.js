import { useEffect, useState, useContext } from 'react';
import { StyleSheet, Text, View, Image, FlatList, useWindowDimensions } from 'react-native';
import { supabase } from '../Back-end/supabase';
import NewButton from '../components/componets';
import { ThemeContext } from '../contexts/themeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Cardapio({ navigation }) {
  const { width } = useWindowDimensions();
  const { theme } = useContext(ThemeContext);
  const [result, setResult] = useState([]);
  const [fotos, setFotos] = useState([]);

  useEffect(() => {
    const fetchGeneral = async () => {
      const { data } = await supabase.storage.from("Imagens").list();
      const urls = data.map((file) => {
        const { data: publicUrl } = supabase.storage.from("Imagens").getPublicUrl(file.name);
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

  // ✅ Calcula columnas automáticamente
  const numColumns = Math.max(1, Math.floor(width / 250));

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <FlatList
        data={result}
        numColumns={numColumns}
        keyExtractor={(_, index) => index.toString()}
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
            <View style={{ flexDirection: 'column', gap: 5 }}>
              <NewButton
                style={styles.btn}
                onPress={async () => {
                  try {
                    const produtosAtuais = await AsyncStorage.getItem('produto');
                    const precosAtuais = await AsyncStorage.getItem('preco');
                    const arrayProdutos = produtosAtuais ? JSON.parse(produtosAtuais) : [];
                    const arrayPrecos = precosAtuais ? JSON.parse(precosAtuais) : [];
                    arrayProdutos.push(item.Nome);
                    arrayPrecos.push(item.Valor);
                    await AsyncStorage.setItem('produto', JSON.stringify(arrayProdutos));
                    await AsyncStorage.setItem('preco', JSON.stringify(arrayPrecos));
                    alert(`Adicionado ${item.Nome} ao carrinho!`);
                  } catch (error) {
                    console.error('Erro ao salvar item:' + error);
                    alert('Erro ao adicionar item ao carrinho');
                  }
                }}
              >
                {"Comprar este produto"}
              </NewButton>
              <NewButton
                style={styles.btn}
                onPress={() => {
                  navigation.navigate('DetalhesCompras', {
                    nombre: item.Nome,
                    Valor: item.Valor,
                    img: fotos.find((i) => i.name.includes(item.Nome))?.url
                  });
                }}
              >
                {"Detalhes do produto"}
              </NewButton>
            </View>
          </View>
        )}
        style={{ flex: 1 }} // 👈 hace que el FlatList ocupe toda la pantalla
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={true} // 👈 fuerza el scroll visible
        showsHorizontalScrollIndicator={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // 👈 asegura que el View ocupe toda la pantalla
  },
  listContent: {
    padding: 10,
    justifyContent: 'space-around',
  },
  card: {
    flex: 1,
    margin: 10,
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
  btn: {
    width: 120,
    height: 50,
    backgroundColor: '#28a745',
    borderRadius: 5,
  },
});
