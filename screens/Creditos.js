
import { StyleSheet, Text, View } from 'react-native';
import NewButton from '../components/componets';
import { ThemeContext } from '../contexts/themeContext';
import { useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Creditos() {

  const { theme } = useContext(ThemeContext);

  async function setSaldo(valor) {
    try {
      const stored = await AsyncStorage.getItem("Valor");
      const parsed = parseFloat(stored);
      const res = Number.isFinite(parsed) ? parsed : 0;
      const result = res + valor;
      // AsyncStorage expects strings — stringify the number
      await AsyncStorage.setItem("Valor", result.toString());
      alert("Compra efetuada com sucesso");
    } catch (error) {
      console.error('Erro ao atualizar saldo:', error);
      alert('Erro ao processar a compra');
    }
  }
  return (
    <View style={[styles.container, { backgroundColor: theme.background, gap: 20 }]}>
      <Text style={[styles.text, { color: theme.text }]} >Comprar Créditos</Text>
      <View style={{ flexDirection: 'row', gap: 10 }} >

        <NewButton onPress={() => {
          setSaldo(5)
        }} >Comprar 5 Créditos</NewButton>

        <NewButton onPress={() => {
          setSaldo(10)
        }} >Comprar 10 Créditos</NewButton>

        <NewButton onPress={() => {
          setSaldo(20)
        }} >Comprar 20 Créditos</NewButton>
      </View>
      <View style={{ flexDirection: 'row', gap: 10 }} >

        <NewButton onPress={() => {
          setSaldo(50)
        }} >Comprar 50 Créditos</NewButton>

        <NewButton onPress={() => {
          setSaldo(75)
        }} >Comprar 75 Créditos</NewButton>

        <NewButton onPress={() => {
          setSaldo(100)
        }} >Comprar 100 Créditos</NewButton>
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