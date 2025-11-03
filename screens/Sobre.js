
import { StyleSheet, Text, View } from 'react-native';

export default function Sobre() {
  return (
    <View style={styles.container}>
      <Text>POV: esta necesitando pito </Text>
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
