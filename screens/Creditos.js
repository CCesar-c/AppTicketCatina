
import { StyleSheet, Text, View } from 'react-native';
import NewButton from '../components/componets';
import { ThemeContext } from '../contexts/themeContext';
import { useContext } from 'react';


export default function Creditos() {

  const { theme } = useContext(ThemeContext);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.text, { color: theme.text }]} >Comprar Créditos</Text>
      <NewButton>Comprar 10 Créditos</NewButton>
      <NewButton>Comprar 50 Créditos</NewButton>
      <NewButton>Comprar 100 Créditos</NewButton>
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
