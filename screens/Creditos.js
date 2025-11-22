
import { StyleSheet, Text, View } from 'react-native';
import NewButton from '../components/componets';
import { ThemeContext } from '../contexts/themeContext';
import { useContext, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TextInput } from 'react-native-web';
import { FontAwesome, FontAwesome6 } from '@expo/vector-icons'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { supabase } from '../Back-end/supabase';

const factura = (valor = '', tipo = '') => {
  alert(`PedidoID: client${Math.random() ^ 2 * 2}\nValor: ${valor}\nType: ${tipo}\nData: ${new Date().toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "medium" })}\nCodeUnique: ${(Math.random() ^ 2 * 3) + "bc-" + "124" + "99-101-115-97-114"}`)
}

function supabaseDinero(dinero) {
  const si = async () => {
    const storedEmail = await AsyncStorage.getItem(`Email`);
    await supabase.from('users').update({ money: Number(dinero) }).eq("Emails", storedEmail)
  }
  si()
}

function PaypixCC() {
  const { theme } = useContext(ThemeContext);
  const [depositarV, setDepositarV] = useState(0);
  const [visibel, setVisibel] = useState('none');

  async function setSaldo(valor) {
    if (valor != 0) {
      try {
        const stored = await AsyncStorage.getItem("Valor");
        const parsed = parseFloat(stored);
        const res = Number.isFinite(parsed) ? parsed : 0;
        const result = res + valor;
        // AsyncStorage expects strings — stringify the number
        await AsyncStorage.setItem("Valor", result.toString());
        factura(valor, "Pix Copia e Cola")
      } catch (error) {
        console.error('Erro ao atualizar saldo:', error);
        alert('Erro ao processar a compra');
      }
    }
  }
  return (
    <View style={[styles.container, { backgroundColor: theme.background, gap: 20, flexDirection: 'column', }]}>

      <TextInput placeholder='Insisra a quantidade a ser depositada' keyboardType='numeric' maxLength={15} style={[{ backgroundColor: theme.buttonBackground, color: 'white', padding: 10, borderRadius: 10 }]} onChangeText={(e) => setDepositarV(Number(e))} />
      <NewButton children={"Prosseguir"} onPress={() => setVisibel("flex")} />

      <View style={{ display: `${visibel} `, flexDirection: 'column', gap: 20, }}>

        <View style={{ flexDirection: 'row', alignItems: "center", gap: 5 }} >
          <Text style={[{ color: theme.text }]} children={"COPIE ESTE CODIGO"} />
          <TextInput value={`type=PAYMENT|id=${Math.random() * 1000 ^ 2}|user=client&&NaN|values?=${depositarV * 1000 ^ 2}`} disabled={true} style={[{ backgroundColor: theme.buttonBackground, color: 'white', padding: 10, borderRadius: 10 }]} />
          <NewButton onPress={() => {
            setSaldo(depositarV).then(() => {
              supabaseDinero(depositarV)
            })
          }} > <FontAwesome name='copy' size={20} /></NewButton>
        </View>

        <View style={{ flexDirection: 'column', flex: 1, alignItems: 'center' }} >
          <NewButton onPress={() => {
            setVisibel("none")
          }} >Cancelar Pagamento</NewButton>
        </View>
      </View>
    </View>

  )
}
function PayCredito() {

  const { theme } = useContext(ThemeContext);
  const [depositarV, setDepositarV] = useState(0);

  async function setSaldo(valor) {
    if (valor != 0) {
      try {
        const stored = await AsyncStorage.getItem("Valor");
        const parsed = parseFloat(stored);
        const res = Number.isFinite(parsed) ? parsed : 0;
        const result = res + valor;
        // AsyncStorage expects strings — stringify the number
        await AsyncStorage.setItem("Valor", result.toString());
        factura(valor, "Credito")
      } catch (error) {
        console.error('Erro ao atualizar saldo:', error);
        alert('Erro ao processar a compra');
      }
    }
  }
  return (
    <View style={[styles.container, { backgroundColor: theme.background, gap: 20 }]}>
      <Text style={[styles.text, { color: theme.text }]} >Comprar Créditos</Text>
      <View style={{ flexDirection: 'column', alignItems: 'center', gap: 10 }} >
        <TextInput placeholder='Insisra o nome do usuario' keyboardType='default' maxLength='30' style={[{ backgroundColor: theme.buttonBackground, color: 'white', padding: 10, borderRadius: 10 }]} />
        <TextInput placeholder='Insisra o numero do cartao' keyboardType='numeric' maxLength={16} style={[{ backgroundColor: theme.buttonBackground, color: 'white', padding: 10, borderRadius: 10 }]} />
        <TextInput placeholder='Insisra o numero de validade do cartao' keyboardType='numeric' maxLength={4} style={[{ backgroundColor: theme.buttonBackground, color: 'white', padding: 10, borderRadius: 10 }]} />
        <TextInput placeholder='Insisra o CVC do cartao' keyboardType='numeric' maxLength={3} style={[{ backgroundColor: theme.buttonBackground, color: 'white', padding: 10, borderRadius: 10 }]} />
        <TextInput placeholder='Insisra a quantidade a ser depositada' keyboardType='numeric' maxLength={15} onChangeText={(e) => setDepositarV(Number(e))} style={[{ backgroundColor: theme.buttonBackground, color: 'white', padding: 10, borderRadius: 10 }]} />
        <NewButton onPress={() => {
          setSaldo(depositarV).then(() => {
            supabaseDinero(depositarV)
          })
        }} >Adicionar Créditos</NewButton>
      </View>
    </View>
  );
}
export default function RouterCreditos({ navigation }) {
  const Tab = createBottomTabNavigator();
  const { theme } = useContext(ThemeContext);
  return (
    <Tab.Navigator initialRouteName='PayCreditos'
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
      <Tab.Screen name='PayCreditos' component={PayCredito} options={{ tabBarIcon: () => <FontAwesome name="credit-card" size={20} color={theme.text} /> }} />
      <Tab.Screen name='PaypixCC' component={PaypixCC} options={{ tabBarIcon: () => <FontAwesome6 name="pix" size={20} color={theme.text} /> }} />


    </Tab.Navigator>

  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 20,
  }
});