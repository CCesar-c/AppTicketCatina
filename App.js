import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Login from './screens/login';
import { useEffect } from 'react';

export default function App() {
  useEffect(() => {
    fetch('http://localhost:3000/enviar')
      .then(res => res.json())
      .then(data => console.log(data))

  }, [])
  return (
    <Login />
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
