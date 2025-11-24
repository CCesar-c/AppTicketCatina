// creditos
import { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View, TextInput, FlatList } from 'react-native';
import NewButton from '../components/componets';
import { ThemeContext } from '../contexts/themeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { supabase } from '../Back-end/supabase';
import { MoneyContext } from '../contexts/ContextMoney';


/**
 * factura: muestra un alert con la factura/generador de código
 * Genera IDs y códigos con operaciones correctas (no bitwise).
 */

async function factura(valor = '', tipo = '') {
  const pedidoId = `client${Math.floor(Math.random() * 1_000_000)}`;
  const codigoUnico = `bc-124-99-101-115-97-114-${Date.now().toString(36)}`;
  const fecha = new Date().toLocaleString('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'medium',
  });
  alert(
    'Comprovante\n' +
    `PedidoID: ${pedidoId}\nValor: ${valor}\nType: ${tipo}\nData: ${fecha}\nCodeUnique: ${codigoUnico}`
  );
  const storedused = await AsyncStorage.getItem("historicoTransacoes")
  const result = storedused ? JSON.parse(storedused) : []
  const newCount = ({
    PedidoID: pedidoId,
    Valor: valor,
    Type: tipo,
    Data: fecha,
    unique: codigoUnico
  })
  const update = [...result, newCount]
  await AsyncStorage.setItem("historicoTransacoes", JSON.stringify(update))
};

/**
 * supabaseDinero: actualiza el campo money (reemplaza el valor)
 * Si quieres sumar al dinero existente, haz una lectura previa y luego update
 */
async function supabaseDinero(dinero) {
  try {
    const storedEmail = await AsyncStorage.getItem('Email');
    console.log("Email:", storedEmail);

    if (!storedEmail) return;

    const { data, error } = await supabase
      .from("users")
      .select("money")
      .eq("Emails", storedEmail)
      .single();

    if (error) {
      console.error("Erro no SELECT:", error);
      return;
    }

    console.log("Money atual:", data.money);

    const result = Number(data.money) + Number(dinero);

    const { error: updateError } = await supabase
      .from("users")
      .update({ money: result })
      .eq("Emails", storedEmail);

    if (updateError) {
      console.error("Erro no UPDATE:", updateError);
      return;
    }

    console.log("UPDATE OK. Novo valor:", result);

  } catch (err) {
    console.error("Erro no try:", err);
  }
}


/**
 * PaypixCC: pantalla para pagamento via Pix (copia & cola simulada)
 */
function PaypixCC() {
  const { theme } = useContext(ThemeContext);
  const [depositarV, setDepositarV] = useState(0);
  const [visible, setVisible] = useState(false);

  async function setSaldo(valor) {
    if (!valor || Number.isNaN(Number(valor)) || Number(valor) <= 0) {
      alert('Valor inválido', 'Insira um valor maior que zero.');
      return;
    }

    try {
      const stored = await AsyncStorage.getItem('Valor');
      const parsed = parseFloat(stored);
      const res = Number.isFinite(parsed) ? parsed : 0;
      const result = res + Number(valor);

      await AsyncStorage.setItem('Valor', result.toString());
      factura(valor, 'Pix Copia e Cola');
      return result;
    } catch (error) {
      console.error('Erro ao atualizar saldo:', error);
      alert('Erro', 'Erro ao processar a compra');
      throw error;
    }
  }

  // Generador seguro de código Pix (simulado)
  const generatePixCode = () => {
    const id = Math.floor(Math.random() * 900000 + 100000); // 6 dígitos
    return `type=PAYMENT|id=${id}|user=client|value=${Number(depositarV).toFixed(2)}`;
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background, padding: 16 }]}>
      <TextInput
        placeholder="Insira a quantidade a ser depositada"
        keyboardType="numeric"
        maxLength={15}
        style={[styles.input, { backgroundColor: theme.buttonBackground, color: 'white' }]}
        onChangeText={(e) => {
          // Asegúrate de permitir decimales con coma o punto
          const sanitized = e.replace(',', '.');
          setDepositarV(Number(sanitized));
        }}
        value={depositarV ? String(depositarV) : ''}
      />

      <NewButton onPress={() => setVisible(true)}>Prosseguir</NewButton>

      {visible && (
        <View style={{ marginTop: 20, width: '100%' }}>
          <View style={{ marginBottom: 12 }}>
            <Text style={[{ color: theme.text, marginBottom: 6 }]}>COPIE ESTE CÓDIGO</Text>
            <TextInput
              value={generatePixCode()}
              editable={false}
              style={[styles.input, { backgroundColor: theme.buttonBackground, color: 'white' }]}
            />
          </View>

          <View style={{ flexDirection: 'row', gap: 10 }}>
            <NewButton
              onPress={async () => {
                try {
                  await setSaldo(depositarV); // actualiza AsyncStorage
                  await supabaseDinero(depositarV); // actualiza supabase
                  setVisible(false);
                } catch (err) {
                  // errores ya manejados dentro de la función
                }
              }}
            >
              <FontAwesome name="copy" size={20} color="white" />
            </NewButton>

            <NewButton
              onPress={() => {
                setVisible(false);
              }}
            >
              Cancelar Pagamento
            </NewButton>
          </View>
        </View>
      )}
    </View>
  );
}
/**
 * PayCredito: pantalla para pago con tarjeta (simulada)
 */
function PayCredito() {
  const { theme } = useContext(ThemeContext);
  const [depositarV, setDepositarV] = useState(0);
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');

  async function setSaldo(valor) {
    if (!valor || Number.isNaN(Number(valor)) || Number(valor) <= 0) {
      alert('Valor inválido', 'Insira um valor maior que zero.');
      return;
    }

    try {
      const stored = await AsyncStorage.getItem('Valor');
      const parsed = parseFloat(stored);
      const res = Number.isFinite(parsed) ? parsed : 0;
      const result = res + Number(valor);

      await AsyncStorage.setItem('Valor', result.toString());
      factura(valor, 'Crédito');
      return result;
    } catch (error) {
      console.error('Erro ao atualizar saldo:', error);
      alert('Erro', 'Erro ao processar a compra');
      throw error;
    }
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background, padding: 16 }]}>
      <Text style={[styles.text, { color: theme.text, marginBottom: 12 }]}>Comprar Créditos</Text>

      <View style={{ width: '100%', gap: 10 }}>
        <TextInput
          placeholder="Insira o nome do usuário"
          keyboardType="default"
          maxLength={30}
          style={[styles.input, { backgroundColor: theme.buttonBackground, color: 'white' }]}
          onChangeText={setCardName}
          value={cardName}
        />

        <TextInput
          placeholder="Insira o número do cartão"
          keyboardType="numeric"
          maxLength={16}
          style={[styles.input, { backgroundColor: theme.buttonBackground, color: 'white' }]}
          onChangeText={(v) => setCardNumber(v.replace(/\D/g, ''))}
          value={cardNumber}
        />

        <TextInput
          placeholder="Validade (MMYY)"
          keyboardType="numeric"
          maxLength={4}
          style={[styles.input, { backgroundColor: theme.buttonBackground, color: 'white' }]}
          onChangeText={(v) => setExpiry(v.replace(/\D/g, ''))}
          value={expiry}
        />

        <TextInput
          placeholder="CVC"
          keyboardType="numeric"
          maxLength={3}
          style={[styles.input, { backgroundColor: theme.buttonBackground, color: 'white' }]}
          onChangeText={(v) => setCvc(v.replace(/\D/g, ''))}
          value={cvc}
        />

        <TextInput
          placeholder="Insira a quantidade a ser depositada"
          keyboardType="numeric"
          maxLength={15}
          style={[styles.input, { backgroundColor: theme.buttonBackground, color: 'white' }]}
          onChangeText={(e) => {
            const sanitized = e.replace(',', '.');
            setDepositarV(Number(sanitized));
          }}
          value={depositarV ? String(depositarV) : ''}
        />

        <NewButton
          onPress={async () => {
            // aqui você deveria validar o cartão (simulação)
            if (!cardNumber || !expiry || !cvc) {
              alert('Dados incompletos', 'Preencha os dados do cartão.');
              return;
            }
            try {
              await setSaldo(depositarV);
              await supabaseDinero(depositarV);
            } catch (err) {
              // já logado nas funções internas
            }
          }}
        >
          Adicionar Créditos
        </NewButton>
      </View>
    </View>
  );
}
function Historico() {
  const { theme } = useContext(ThemeContext);
  const [historyTransacoes, SethistoryTransacoes] = useState([])
  useEffect(() => {
    const respons = async () => {
      SethistoryTransacoes(JSON.parse(await AsyncStorage.getItem("historicoTransacoes")))
    }
    respons()
  }, [])
  return (
    <View>
      <Text children={"Historico de Transações"} style={[styles.title, { color: theme.text }]} />
      <FlatList
        data={historyTransacoes}
        keyExtractor={(_, index) => index.toString()}
        showsHorizontalScrollIndicator={true}
        numColumns={1}
        renderItem={({ item }) => (
          <View style={[styles.itemContainer, { backgroundColor: theme.background }]} >
            <Text children={`PedidoID: ${item.PedidoID} Valor: ${item.Valor} Type: ${item.Type} Data: ${item.Data} CodeUnique: ${item.unique}`} style={[styles.text, { color: theme.text }]} />
          </View>
        )}
      />
    </View>
  )
}
export default function RouterCreditos({ navigation }) {
  const Tab = createBottomTabNavigator();
  const { theme } = useContext(ThemeContext);

  return (
    <Tab.Navigator
      initialRouteName="PayCreditos"
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: theme.text,
        tabBarInactiveTintColor: 'gray',
        headerTitleStyle: { color: theme.text },
        headerStyle: { backgroundColor: theme.background },
        tabBarStyle: { backgroundColor: theme.background },
        headerLeft: () => (
          <NewButton
            style={{ height: 40, width: 40 }}
            onPress={() => navigation.navigate('Drawer')}
          >
            <FontAwesome name="arrow-left" size={20} color={theme.text} />
          </NewButton>
        ),
      }}
    >
      <Tab.Screen
        name='Historico de Transações'
        component={Historico}
        options={{ tabBarIcon: () => <FontAwesome name='history' size={20} color={theme.text} /> }}
      />
      <Tab.Screen
        name="PayCreditos"
        component={PayCredito}
        options={{ tabBarIcon: () => <FontAwesome name="credit-card" size={20} color={theme.text} /> }}
      />
      <Tab.Screen
        name="PaypixCC"
        component={PaypixCC}
        options={{ tabBarIcon: () => <FontAwesome name="qrcode" size={20} color={theme.text} /> }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor set dynamically
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  text: {
    fontSize: 20,
  },
  itemContainer: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    marginVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#dee2e6',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  input: {
    padding: 10,
    borderRadius: 10,
    width: '100%',
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  }
});
