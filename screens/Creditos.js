
import { StyleSheet, Text, View } from 'react-native';
import NewButton from '../components/componets';


export default function Creditos() {
  return (
    <View style={styles.container}>
      <Text>Comprar Créditos</Text>
      <NewButton style={{ paddingVertical: 10, paddingHorizontal: 30, backgroundColor: 'white', borderRadius: 10, borderColor: "black", borderWidth: 1 }} >Comprar 10 Créditos</NewButton>
      <NewButton style={{ paddingVertical: 10, paddingHorizontal: 30, backgroundColor: 'white', borderRadius: 10, borderColor: "black", borderWidth: 1 }} >Comprar 50 Créditos</NewButton>
      <NewButton style={{ paddingVertical: 10, paddingHorizontal: 30, backgroundColor: 'white', borderRadius: 10, borderColor: "black", borderWidth: 1 }} >Comprar 100 Créditos</NewButton>
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
