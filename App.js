import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ThemeProvider, { ThemeContext } from './contexts/themeContext';
import DrawerNavigator from './screens/Drawer';
import Login from './screens/Login';
import AdminHome from './screens/AdminHome';
import DetalhesCompras from './screens/DetalhesCompras';
import Cardapio from './screens/Cardapio';
import Creditos from './screens/Creditos';
import { useContext } from 'react';

const Stack = createStackNavigator();

function RootNavigator() {
  const { theme } = useContext(ThemeContext);

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="AdminHome"
        screenOptions={{
          headerStyle: { backgroundColor: theme.background },
          headerTintColor: theme.text,
        }}
      >
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Drawer" component={DrawerNavigator} options={{ headerShown: false }} />
        <Stack.Screen name="DetalhesCompras" component={DetalhesCompras} />
        <Stack.Screen name="AdminHome" component={AdminHome} />
        <Stack.Screen name="Cardapio" component={Cardapio} />
        <Stack.Screen name="Creditos" component={Creditos} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <RootNavigator />
    </ThemeProvider>
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
