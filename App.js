import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './screens/Home';
import Login from './screens/login';
import AdminHome from './screens/adminHome';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="login">
        <Stack.Screen name="login" component={Login} />
        <Stack.Screen name="Home" component={Home} options={{
          headerRight: () => (
            <Button style={{ fontSize: 22, marginRight: 15 }}>DetalhesCompras</Button>
          ),
        }} />
        <Stack.Screen name="DetalhesCompras" component={DetalhesCompras} />
        <Stack.Screen name="adminHome" component={AdminHome} />
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
