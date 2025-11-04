import { StyleSheet, Text, View } from 'react-native';
let Criadores = ("🖥️ Cesar / 🖥️ Davi Grah / 🖥️ Gustavo Camargo");
export default function Sobre() {
  return (
    <View style={styles.container}>
      <Text>Criadores: {Criadores}</Text>
      
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
