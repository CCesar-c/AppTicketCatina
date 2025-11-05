import { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ThemeContext } from '../contexts/themeContext';
let Criadores = ("🖥️ Cesar / 🖥️ Davi Grah / 🖥️ Gustavo Camargo");
export default function Sobre() {
  const { theme } = useContext(ThemeContext);
  return (
    <View style={[styles.container, {backgroundColor: theme.background }] }>
      <Text style={[{color: theme.text }]} >Criadores: {Criadores}</Text>
      <Text style={[{color: theme.text }]}>Compativel com todas as aplicações (Menos o PC do Davi)</Text>
      
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
});
