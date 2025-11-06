
import { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, Image } from 'react-native';
import { supabase } from '../Back-end/supabase';
import { ThemeContext } from '../contexts/themeContext';

export default function AdminHome() {
  const {theme } = useContext(ThemeContext)
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
  return (
    <View style={[{ height: '32.125%', backgroundColor: theme.background }]}>
      <Text>Tela do Admin</Text>
      <FlatList data={result} keyExtractor={(_, index) => index.toString()}
      numColumns={8}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image
              source={{ uri: fotos.find((i) => i.name.includes(item.Nome))?.url }}
              style={styles.image}
              resizeMode='contain'
            />
            <Text style={styles.text}>
              🍽️ Nome: {item.Nome}{"\n"}
              💰 Preço: {item.Valor + " R$"}
            </Text>
          </View>
        )} />
    </View>
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