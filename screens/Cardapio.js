import { useEffect, useState, useContext } from 'react';
import { StyleSheet, Text, View, Image, ScrollView } from 'react-native';
import { supabase } from '../Back-end/supabase';
import NewButton from '../components/componets';
import { ThemeContext } from '../contexts/themeContext';
import { FontAwesome, MaterialCommunityIcons, FontAwesome6 } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

function CardapioComidas({ navigation }) {
  const { theme } = useContext(ThemeContext);
  const [result, setResult] = useState([]);
  const [fotos, setFotos] = useState([]);
  const [creditos, setCreditos] = useState()
  const [_, setTime] = useState(0);

  useEffect(() => {

    const respons = async () => {
      try {
        const res = await AsyncStorage.getItem("creditos");
        if (res) setCreditos(res);
      } catch (error) {
        console.error("Erro ao carregar saldo:", error);
      }
    };
    respons();
    const interval = setInterval(() => {
      setTime(prev => prev + 1);
      respons();
    }, 2500);

    const fetchGeneral = async () => {
      const { data } = await supabase.storage.from("Imagens").list();
      const urls = data.map((file) => {
        const { data: publicUrl } = supabase.storage.from("Imagens").getPublicUrl(file.name);
        return { name: file.name, url: publicUrl.publicUrl };
      });
      setFotos(urls);

      const { data: comidas } = await supabase.from('Comidas').select('*').eq("Disponivel", true);

      setResult(comidas || []);
    };
    fetchGeneral();
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <View style={[{ height: '100%', backgroundColor: theme.background }]}>
      <Text style={[styles.text, { color: theme.text, fontSize: 20, textAlign: 'right' }]} >saldo: {creditos}$ </Text>
      <ScrollView showsVerticalScrollIndicator={true} contentContainerStyle={styles.container}>

        {result.map((item, index) => {
          return (
            <View key={index} style={[styles.card, { backgroundColor: theme.buttonBackground }]}>
              <Image
                source={{ uri: fotos.find((i) => i.name.includes(item.Nome))?.url }}
                style={styles.image}
                resizeMode='contain'
              />
              <Text style={[styles.text, { color: theme.text, textShadowColor: 'black', textShadowOffset: { height: 2, width: 2 } }]}>
                🍽️ Nome: {item.Nome}{"\n"}
                💰 Preço: {item.Creditos + " $"}
              </Text>
              <View style={{ flexDirection: 'column' }} >
                <NewButton style={{ width: 100, height: 60, backgroundColor: '#28a745', borderRadius: 5 }}
                  onPress={async () => {
                    const credito = parseFloat(await AsyncStorage.getItem("creditos"))
                    if (credito >= item.Creditos) {
                      const fecha = new Date().toLocaleString('es-ES', {
                        dateStyle: 'short',
                        timeStyle: 'medium',
                      });
                      await supabase.from("Comidas").update([{ Vendas: item.Vendas + 1 }]).eq("Nome", item.Nome)
                      await AsyncStorage.setItem("creditos", parseFloat(credito - item.Creditos))
                      await AsyncStorage.setItem("data", fecha)
                      try {
                        //Carregar arrays existentes
                        const produtosAtuais = await AsyncStorage.getItem('produto');
                        const precosAtuais = await AsyncStorage.getItem('preco');

                        // Converter para array ou criar novo se não existir
                        const arrayProdutos = produtosAtuais ? JSON.parse(produtosAtuais) : [];
                        const arrayPrecos = precosAtuais ? JSON.parse(precosAtuais) : [];

                        // Adicionar novos itens
                        arrayProdutos.push(item.Nome);
                        arrayPrecos.push(item.Creditos);

                        // Salvar arrays atualizados
                        await AsyncStorage.setItem('produto', JSON.stringify(arrayProdutos));
                        await AsyncStorage.setItem('preco', JSON.stringify(arrayPrecos));

                        alert(`Adicionado ${item.Nome} ao carrinho!`);
                      } catch (error) {
                        console.error('Erro ao salvar item:' + error);
                        alert('Erro ao adicionar item ao carrinho');
                      }
                    } else {
                      alert("Saldo insuficiente!!\n-Porfavor compre creditos")
                    }

                  }}>{"Comprar este produto"}
                </NewButton>
                <NewButton
                  style={{ width: 100, height: 60, backgroundColor: '#28a745', borderRadius: 5 }}
                  onPress={() => {
                    navigation.navigate('DetalhesCompras', {
                      nombre: item.Nome,
                      Valor: item.Creditos,
                      img: fotos.find((i) => i.name.includes(item.Nome))?.url
                    });
                  }}>
                  {"Detalhes do produto"}
                </NewButton>
              </View>
            </View>
          )
        })}
      </ScrollView >
    </View >
  )
};

function CardapioBebidas({ navigation }) {
  const { theme } = useContext(ThemeContext);
  const [result, setResult] = useState([]);
  const [fotos, setFotos] = useState([]);
  const [creditos, setCreditos] = useState()
  const [_, setTime] = useState(0);

  useEffect(() => {

    const respons = async () => {
      try {
        const res = await AsyncStorage.getItem("creditos");
        if (res) setCreditos(res);
      } catch (error) {
        console.error("Erro ao carregar saldo:", error);
      }
    };
    respons();
    const interval = setInterval(() => {
      setTime(prev => prev + 1);
      respons();
    }, 2500);

    const fetchGeneral = async () => {
      const { data } = await supabase.storage.from("Imagens").list();
      const urls = data.map((file) => {
        const { data: publicUrl } = supabase.storage.from("Imagens").getPublicUrl(file.name);
        return { name: file.name, url: publicUrl.publicUrl };
      });
      setFotos(urls);

      const { data: bebidas } = await supabase.from('Bebidas').select('*').eq("Disponivel", true);

      setResult(bebidas || []);
    };
    fetchGeneral();
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <View style={[{ height: '100%', backgroundColor: theme.background }]}>
      <Text style={[styles.text, { color: theme.text, fontSize: 20, textAlign: 'right' }]} >saldo: {creditos}$ </Text>
      <ScrollView showsVerticalScrollIndicator={true} contentContainerStyle={styles.container}>

        {result.map((item, index) => {
          return (
            <View key={index} style={[styles.card, { backgroundColor: theme.buttonBackground }]}>
              <Image
                source={{ uri: fotos.find((i) => i.name.includes(item.Nome))?.url }}
                style={styles.image}
                resizeMode='contain'
              />
              <Text style={[styles.text, { color: theme.text, textShadowColor: 'black', textShadowOffset: { height: 2, width: 2 } }]}>
                🍽️ Nome: {item.Nome}{"\n"}
                💰 Preço: {item.Creditos + " $"}
              </Text>
              <View style={{ flexDirection: 'column' }} >
                <NewButton style={{ width: 100, height: 60, backgroundColor: '#28a745', borderRadius: 5 }}
                  onPress={async () => {
                    const credito = parseFloat(await AsyncStorage.getItem("creditos"))

                    if (credito >= item.Creditos) {
                      const fecha = new Date().toLocaleString('es-ES', {
                        dateStyle: 'short',
                        timeStyle: 'medium',
                      });
                      await supabase.from("Bebidas").update([{ Vendas: item.Vendas + 1 }]).eq("Nome", item.Nome)
                      await AsyncStorage.setItem("creditos", parseFloat(credito - item.Creditos))
                      await AsyncStorage.setItem("data", fecha)
                      try {
                        //Carregar arrays existentes
                        const produtosAtuais = await AsyncStorage.getItem('produto');
                        const precosAtuais = await AsyncStorage.getItem('preco');

                        // Converter para array ou criar novo se não existir
                        const arrayProdutos = produtosAtuais ? JSON.parse(produtosAtuais) : [];
                        const arrayPrecos = precosAtuais ? JSON.parse(precosAtuais) : [];

                        // Adicionar novos itens
                        arrayProdutos.push(item.Nome);
                        arrayPrecos.push(item.Creditos);

                        // Salvar arrays atualizados
                        await AsyncStorage.setItem('produto', JSON.stringify(arrayProdutos));
                        await AsyncStorage.setItem('preco', JSON.stringify(arrayPrecos));

                        alert(`Adicionado ${item.Nome} ao carrinho!`);
                      } catch (error) {
                        console.error('Erro ao salvar item:' + error);
                        alert('Erro ao adicionar item ao carrinho');
                      }
                    } else {
                      alert("Saldo insuficiente!!\n-Porfavor compre creditos")
                    }

                  }}>{"Comprar este produto"}
                </NewButton>
                <NewButton
                  style={{ width: 100, height: 60, backgroundColor: '#28a745', borderRadius: 5 }}
                  onPress={() => {
                    navigation.navigate('DetalhesCompras', {
                      nombre: item.Nome,
                      Valor: item.Creditos,
                      img: fotos.find((i) => i.name.includes(item.Nome))?.url
                    });
                  }}>
                  {"Detalhes do produto"}
                </NewButton>
              </View>
            </View>
          )
        })}
      </ScrollView >
    </View >
  )
};

function CardapioOutros({ navigation }) {
  const { theme } = useContext(ThemeContext);
  const [result, setResult] = useState([]);
  const [fotos, setFotos] = useState([]);
  const [creditos, setCreditos] = useState()
  const [_, setTime] = useState(0);

  useEffect(() => {

    const respons = async () => {
      try {
        const res = await AsyncStorage.getItem("creditos");
        if (res) setCreditos(res);
      } catch (error) {
        console.error("Erro ao carregar saldo:", error);
      }
    };
    respons();
    const interval = setInterval(() => {
      setTime(prev => prev + 1);
      respons();
    }, 2500);

    const fetchGeneral = async () => {
      const { data } = await supabase.storage.from("Imagens").list();
      const urls = data.map((file) => {
        const { data: publicUrl } = supabase.storage.from("Imagens").getPublicUrl(file.name);
        return { name: file.name, url: publicUrl.publicUrl };
      });
      setFotos(urls);

      const { data: outros } = await supabase.from('Outras opcoes').select('*').eq("Disponivel", true);

      setResult(outros || []);
    };
    fetchGeneral();
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <View style={[{ height: '100%', backgroundColor: theme.background }]}>
      <Text style={[styles.text, { color: theme.text, fontSize: 20, textAlign: 'right' }]} >saldo: {creditos}$ </Text>
      <ScrollView showsVerticalScrollIndicator={true} contentContainerStyle={styles.container}>

        {result.map((item, index) => {
          return (
            <View key={index} style={[styles.card, { backgroundColor: theme.buttonBackground }]}>
              <Image
                source={{ uri: fotos.find((i) => i.name.includes(item.Nome))?.url }}
                style={styles.image}
                resizeMode='contain'
              />
              <Text style={[styles.text, { color: theme.text, textShadowColor: 'black', textShadowOffset: { height: 2, width: 2 } }]}>
                🍽️ Nome: {item.Nome}{"\n"}
                💰 Preço: {item.Creditos + " $"}
              </Text>
              <View style={{ flexDirection: 'column' }} >
                <NewButton style={{ width: 100, height: 60, backgroundColor: '#28a745', borderRadius: 5 }}
                  onPress={async () => {
                    const credito = parseFloat(await AsyncStorage.getItem("creditos"))

                    if (credito >= item.Creditos) {
                      const fecha = new Date().toLocaleString('es-ES', {
                        dateStyle: 'short',
                        timeStyle: 'medium',
                      });
                      await supabase.from("Outras opcoes").update([{ Vendas: item.Vendas + 1 }]).eq("Nome", item.Nome)
                      await AsyncStorage.setItem("creditos", parseFloat(credito - item.Creditos))
                      await AsyncStorage.setItem("data", fecha)
                      try {
                        //Carregar arrays existentes
                        const produtosAtuais = await AsyncStorage.getItem('produto');
                        const precosAtuais = await AsyncStorage.getItem('preco');

                        // Converter para array ou criar novo se não existir
                        const arrayProdutos = produtosAtuais ? JSON.parse(produtosAtuais) : [];
                        const arrayPrecos = precosAtuais ? JSON.parse(precosAtuais) : [];

                        // Adicionar novos itens
                        arrayProdutos.push(item.Nome);
                        arrayPrecos.push(item.Creditos);

                        // Salvar arrays atualizados
                        await AsyncStorage.setItem('produto', JSON.stringify(arrayProdutos));
                        await AsyncStorage.setItem('preco', JSON.stringify(arrayPrecos));

                        alert(`Adicionado ${item.Nome} ao carrinho!`);
                      } catch (error) {
                        console.error('Erro ao salvar item:' + error);
                        alert('Erro ao adicionar item ao carrinho');
                      }
                    } else {
                      alert("Saldo insuficiente!!\n-Porfavor compre creditos")
                    }

                  }}>{"Comprar este produto"}
                </NewButton>
                <NewButton
                  style={{ width: 100, height: 60, backgroundColor: '#28a745', borderRadius: 5 }}
                  onPress={() => {
                    navigation.navigate('DetalhesCompras', {
                      nombre: item.Nome,
                      Valor: item.Creditos,
                      img: fotos.find((i) => i.name.includes(item.Nome))?.url
                    });
                  }}>
                  {"Detalhes do produto"}
                </NewButton>
              </View>
            </View>
          )
        })}
      </ScrollView >
    </View >
  )
};

function Ranking() {
  const [rank, setRanking] = useState([]);
  const [fotos, setFotos] = useState([]);
  const { theme } = useContext(ThemeContext);

  useEffect(() => {

    const fetchTodo = async () => {
      const { data } = await supabase.storage.from("Imagens").list();
      const urls = data.map((file) => {
        const { data: publicUrl } = supabase.storage.from("Imagens").getPublicUrl(file.name);
        return { name: file.name, url: publicUrl.publicUrl };
      });
      setFotos(urls);
      const { data: comidas } = await supabase.from('Comidas').select('*').eq("Disponivel", true);
      const { data: bebidas } = await supabase.from('Bebidas').select('*').eq("Disponivel", true);
      const { data: outros } = await supabase.from('Outras opcoes').select('*').eq("Disponivel", true);
      const total = [
        ...(comidas || []),
        ...(bebidas || []),
        ...(outros || []),
      ];
      total.sort((a, b) => b.Vendas - a.Vendas)
      setRanking(total)
      return () => { clearInterval(interval) }
    }
    const interval = setInterval(() => {
      fetchTodo()
      setTime(prev => prev + 1);
      fetchTodo()
    }, 5000);
  }, [])
  return (
    <View style={[{ height: '100%', backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>Produtos mais comprados 🏆</Text>

      <ScrollView showsVerticalScrollIndicator={true} contentContainerStyle={styles.container} >
        {rank.map((item, index) => (
          <View key={index} style={[styles.card, { backgroundColor: theme.buttonBackground }]}>
            <Image source={{ uri: fotos.find((i) => i.name.includes(item.Nome))?.url }} style={styles.image} />
            <Text style={[styles.text, { color: theme.text, textShadowColor: 'black', textShadowOffset: { height: 2, width: 2 } }]}>
              Top: {index + 1} {"\n"} Nome: {item.Nome} {"\n"} Vendas: {item.Vendas}
            </Text>
          </View>
        ))
        }
      </ScrollView >
    </View >
  );
}

export default function RouterCardapio({ navigation }) {
  const { theme } = useContext(ThemeContext);
  const Tab = createBottomTabNavigator();

  return (
    <Tab.Navigator
      initialRouteName="Comidas"
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: theme.text,
        tabBarInactiveTintColor: 'gray',
        headerTitleStyle: { color: theme.text },
        headerStyle: { backgroundColor: theme.background, },
        tabBarStyle: { backgroundColor: theme.background, },

        headerLeft: () => (
          <NewButton
            style={{ height: 40, width: 40 }}
            onPress={() => navigation.navigate("Drawer")}
          >
            <FontAwesome name="arrow-left" size={20} color={theme.colorIcon} />
          </NewButton>
        ),
      }}
    >
      <Tab.Screen
        name="Comidas"
        component={CardapioComidas}
        options={{
          tabBarIcon: () => (
            <MaterialCommunityIcons name="food-drumstick" size={20} color={theme.text} />
          ),
        }}
      />
      <Tab.Screen
        name="Bebidas"
        component={CardapioBebidas}
        options={{
          tabBarIcon: () => (
            <FontAwesome name="glass" size={20} color={theme.text} />
          ),
        }}
      />
      <Tab.Screen
        name="Outros"
        component={CardapioOutros}
        options={{
          tabBarIcon: () => (
            <FontAwesome name="ellipsis-h" size={20} color={theme.text} />
          ),
        }}
      />
      <Tab.Screen
        name="Ranking"
        component={Ranking}
        options={{
          tabBarIcon: () => (
            <FontAwesome6 name="ranking-star" size={24} color={theme.text} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },

  card: {
    width: 200,
    marginBottom: 15,
    padding: 10,
    borderRadius: 10,

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
    fontSize: 16, fontWeight: 'bold', textAlign: 'center',
  },
});