import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ThemeProvider, { ThemeContext } from './contexts/themeContext';
import DrawerNavigator from './screens/Drawer';
import Login from './screens/Login';
import RouterAdmin from './screens/AdminOptions';
import DetalhesCompras from './screens/DetalhesCompras';
import RouterCardapio from './screens/Cardapio';
import Creditos from './screens/Creditos';
import { useContext } from 'react';

function RootNavigator() {
  const { theme } = useContext(ThemeContext);
  const Stack = createStackNavigator();
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerStyle: { backgroundColor: theme.background },
          headerTintColor: theme.text,
          headerShown: false,
        }}
      >
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Drawer" component={DrawerNavigator} options={{ headerShown: false }} />
        <Stack.Screen name="DetalhesCompras" component={DetalhesCompras} />
        <Stack.Screen name="RouterAdmin" component={RouterAdmin} options={{ headerShown: false }} />
        <Stack.Screen name="Cardapio" component={RouterCardapio} options={{ headerShown: false }} />
        <Stack.Screen name="Creditos" component={Creditos}options={{ headerShown: true }} />
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
