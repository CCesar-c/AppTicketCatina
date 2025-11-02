import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import DrawerNavigator from './screens/Drawer';
import Login from './screens/Login';
import AdminHome from './screens/AdminHome';
import DetalhesCompras from './screens/DetalhesCompras';
import Cardapio from './screens/Cardapio';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Drawer">
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Drawer" component={DrawerNavigator} options={{ headerShown: false }} />
        <Stack.Screen name="DetalhesCompras" component={DetalhesCompras} />
        <Stack.Screen name="AdminHome" component={AdminHome} />
        <Stack.Screen name="Cardapio" component={Cardapio} />
      </Stack.Navigator>
    </NavigationContainer>

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
