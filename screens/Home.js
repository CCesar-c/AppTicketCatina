import { StyleSheet, Text, View } from 'react-native';
import { useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NewButton } from '../components/componets';
import { FontAwesome, AntDesign } from '@expo/vector-icons';
import { ThemeContext } from '../contexts/themeContext';
import * as Animatable from 'react-native-animatable';
import { MoneyContext } from '../contexts/ContextMoney';
import QRCode from 'react-native-qrcode-svg';

export default function Home({ navigation }) {
  const { theme } = useContext(ThemeContext);
  const { Valor } = useContext(MoneyContext)
  const [tickets, setTickets] = useState(0);
  const [ativarTela, SetAtivarTela] = useState(false);
  const [_, setTime] = useState(0);

  async function ticketsGet() {
    const storedEmail = await AsyncStorage.getItem('Email');
    const res = await AsyncStorage.getItem(`Tickets${storedEmail}`);
    setTickets(parseFloat(res) || 0);
  }

  async function ticketconta() {
    if (tickets >= 1) return
    const newTickets = (tickets ?? 0) + 1;
    setTickets(newTickets);
    const storedEmail = await AsyncStorage.getItem('Email');
    await AsyncStorage.setItem(`Tickets${storedEmail}`, String(newTickets));
  }

  useEffect(() => {
    ticketsGet();
    const interval = setInterval(async () => {
      ticketsGet();
      setTime(prev => prev + 1);
    }, 2500);

    const ticketcount = setInterval(async () => {
      ticketconta();
      setTime(prev => prev + 1);
    }, 60000);

    return () => {
      clearInterval(ticketcount);
      clearInterval(interval);
    };
  }, []);
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {ativarTela == false ? <View>
        <Animatable.View animation="fadeInDown">
          <Text style={{ fontSize: 24, margin: 10, color: theme.text }}> Ticket: {tickets}{"\n"}Saldo: R${Valor} </Text>
        </Animatable.View>

        <View style={styles.row}>
          <Animatable.View animation="bounceIn" delay={300} style={styles.collum}>
            <NewButton style={styles.button} onPress={() => { navigation.navigate('Creditos') }}>
              <FontAwesome name="dollar" size={20} color={`${theme.colorIcon}`} />
            </NewButton>
            <Text style={[styles.text, { color: theme.text }]}>Recarregar {"\n"}Creditos</Text>
          </Animatable.View>

          <Animatable.View animation="bounceIn" delay={450} style={styles.collum}>
            <NewButton style={styles.button} onPress={() => navigation.navigate('Cardapio')}>
              <AntDesign name="shop" size={20} color={`${theme.colorIcon}`} />
            </NewButton>
            <Text style={[styles.text, { color: theme.text }]}>Comprar {"\n"}na Cantina</Text>
          </Animatable.View>
          <Animatable.View animation="bounceIn" delay={600} style={styles.collum}>
            <NewButton style={styles.button} onPress={() => SetAtivarTela(true)}>
              <AntDesign name="qrcode" size={20} color={`${theme.colorIcon}`} />
            </NewButton>
            <Text style={[styles.text, { color: theme.text }]}>Usar ticket {"\n"}na Cantina</Text>
          </Animatable.View>
        </View>
      </View> : null}
      {
        ativarTela ? (
          <View style={{
            ...StyleSheet.absoluteFillObject,
            alignItems: "center",
            justifyContent: "center"
          }}>
            <Animatable.View
              animation="fadeIn"
              style={{ alignItems: 'center', justifyContent: 'center', gap: 10, flexDirection: 'column' }}
            >
              <Text children={"Escaneie o QRcode"} style={[{ color: theme.text }]} />
              <View style={[{ padding: 5, backgroundColor: theme.borderColor }]} >
                <QRCode value="Ticket Valido" size={250} />
              </View>

              <NewButton
                children={"Já está Pago?"}
                onPress={async () => {
                  SetAtivarTela(false)
                  const storedEmail = await AsyncStorage.getItem('E-mail');
                  tickets == 1
                    ? (
                      await AsyncStorage.setItem(`tickets${storedEmail}`, String(tickets - 1)),
                      alert("Comida adquirida\n-Bolacha Club Social\n-copo de suco tang de uva")
                    )
                    : alert("Não tem Ticket disponível..")
                }}
              />

              <NewButton
                children={"Cancelar uso do ticket"}
                onPress={() => SetAtivarTela(false)}
              />
            </Animatable.View>
          </View>
        ) : null
      }
    </View >
  );
}


const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    flex: 1,
    alignItems: 'flex-start',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 30,

  },
  collum: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  button: {
    height: 50,
    width: 50,
    borderRadius: 50,
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    margin: 10,
    fontWeight: 'bold',
  }

});
