import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

import transition from './screen/transactions';
import login from './screen/login';
import home from './screen/home';

export default function App() {
  return (
    <View style={styles.container}>
      <Text>O Pascal é Gay</Text>
      <StatusBar style="auto" />
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
