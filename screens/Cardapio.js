import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, ScrollView } from 'react-native';
import { supabase } from '../Back-end/supabase';
import NewButton from '../components/componets';

export default function Cardapio() {
  const [result, setResult] = useState([]);
  const [fotos, setFotos] = useState([]);

  useEffect(() => {
    const fetchFotos = async () => {
      const res = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?f=a'); // varias fotos
      const json = await res.json();
      setFotos(json.meals || []);
    };

    const fetchData = async () => {
      const { data, error } = await supabase
        .from('Comidas')
        .select('*');
      setResult(data || []);
    };

    fetchData();
    fetchFotos();
  }, []);

  

  return (
    <View style={{ height: '100vh' }}>
      <ScrollView contentContainerStyle={styles.container}>
        {result.map((item, index) => (
          <View key={item.id} style={styles.card}>
            <Image
              resizeMode='contain'
              source={{ uri: fotos[index % fotos.length]?.strMealThumb }}
              style={styles.image}
            />
            <Text style={styles.text}>
              🍽️ Nome: {item.Nome}{"\n"}
              💰 Preço: {item.Valor + " Reais"}
            </Text>
            <NewButton style={{ width: '120px', height: '60px', backgroundColor: '#28a745', borderRadius: 5, marginTop: 10, }} onPress={() => alert(`Adicionado ${item.Nome} ao carrinho!`)}>
              {"Adicionar ao Carrinho"}
            </NewButton>
          </View>
        ))}
      </ScrollView>
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
  image: { width: '100%', height: 200, borderRadius: 10, marginBottom: 10 },
  text: { fontSize: 16, fontWeight: 'bold', textAlign: 'center' },
});
