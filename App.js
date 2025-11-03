import { StyleSheet, } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ThemeProvider from './contexts/themeContext';
import DrawerNavigator from './screens/Drawer';
import Login from './screens/Login';
import AdminHome from './screens/AdminHome';
import DetalhesCompras from './screens/DetalhesCompras';
import Cardapio from './screens/Cardapio';
import Creditos from './screens/Creditos';

const Stack = createStackNavigator();

export default function App() {

  return (
    <NavigationContainer>
      <ThemeProvider>
        <Stack.Navigator initialRouteName="Drawer">
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Drawer" component={DrawerNavigator} options={{ headerShown: false }} />
          <Stack.Screen name="DetalhesCompras" component={DetalhesCompras} />
          <Stack.Screen name="AdminHome" component={AdminHome} />
          <Stack.Screen name="Cardapio" component={Cardapio} />
          <Stack.Screen name="Creditos" component={Creditos} />
        </Stack.Navigator>
      </ThemeProvider>
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
