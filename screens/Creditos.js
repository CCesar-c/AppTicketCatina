
import { StyleSheet, Text, View } from 'react-native';
import NewButton from '../components/componets';
import { ThemeContext } from '../contexts/themeContext';
import { useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Creditos() {

  const { theme } = useContext(ThemeContext);

  async function setSaldo(valor) {

    const res = parseFloat(await AsyncStorage.getItem("Valor")) || 0;
    const result = res + valor;
    await AsyncStorage.setItem("Valor", parseFloat(result));
    alert("Compra efetuada com suscesso")
  }
  return (
    <View style={[styles.container, { backgroundColor: theme.background, gap: 20 }]}>
      <Text style={[styles.text, { color: theme.text }]} >Comprar Créditos</Text>
      <View style={{ flexDirection: 'row', gap: 10 }} >

        <NewButton onPress={() => {
          setSaldo(10)
        }} >Comprar 10 Créditos</NewButton>

        <NewButton onPress={() => {
          setSaldo(20)
        }} >Comprar 100 Créditos</NewButton>

        <NewButton onPress={() => {
          setSaldo(50)
        }} >Comprar 500 Créditos</NewButton>
      </View>
      <View style={{ flexDirection: 'row', gap: 10 }} >

        <NewButton onPress={() => {
          setSaldo(75)
        }} >Comprar 1.000 Créditos</NewButton>

        <NewButton onPress={() => {
          setSaldo(100)
        }} >Comprar 5.000 Créditos</NewButton>

        <NewButton onPress={() => {
          setSaldo(150)
        }} >Comprar 10.000 Créditos</NewButton>
      </View>
    </View>
  );
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
