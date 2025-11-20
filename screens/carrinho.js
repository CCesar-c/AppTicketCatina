import React, { useEffect, useState, useContext } from 'react';
import { ThemeContext } from '../contexts/themeContext';
import { MoneyContext } from '../contexts/ContextMoney'
import { StyleSheet, Text, View, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NewButton from '../components/componets';
import * as Animatable from 'react-native-animatable';

export default function Carrinho() {
    const { theme } = useContext(ThemeContext);
    const [produtos, setProdutos] = useState([])
    const [precos, setPrecos] = useState([])
    const [data, setdata] = useState([])
    const [_, setTime] = useState(0);
    const [total, setTotal] = useState(0);
    const { Valor } = useContext(MoneyContext);

    const carregarHistorico = async () => {
        try {
            const produtosStorage = await AsyncStorage.getItem('produto');
            const precosStorage = await AsyncStorage.getItem('preco');
            const dataStorage = await AsyncStorage.getItem('data');

            if (produtosStorage) {
                setProdutos(JSON.parse(produtosStorage));
            }
            if (precosStorage) {
                setPrecos(JSON.parse(precosStorage));
            }
            if (dataStorage) {
                setdata(dataStorage);
            }
        } catch (error) {
            console.error('Erro ao carregar histórico:', error);
        }
    };

    function Comprar() {
        (async () => {
            if (Valor >= total) {
                try {
                    // read current cart
                    const produtosStorage = await AsyncStorage.getItem('produto');
                    const precosStorage = await AsyncStorage.getItem('preco');
                    const produtosArr = produtosStorage ? JSON.parse(produtosStorage) : [];
                    const precosArr = precosStorage ? JSON.parse(precosStorage) : [];

                    // build historico entries
                    const fecha = new Date().toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'medium' });
                    const novos = produtosArr.map((p, i) => ({ produto: p, preco: precosArr[i], data: fecha }));

                    // append to existing historico
                    const historicoStorage = await AsyncStorage.getItem('historico');
                    const historicoArr = historicoStorage ? JSON.parse(historicoStorage) : [];
                    const updatedHistorico = [...historicoArr, ...novos];
                    await AsyncStorage.setItem('historico', JSON.stringify(updatedHistorico));

                    // update Valor
                    const novoValor = parseFloat(Valor) - parseFloat(total || 0);
                    await AsyncStorage.setItem('Valor', String(novoValor));

                    // clear cart
                    await AsyncStorage.removeItem('produto');
                    await AsyncStorage.removeItem('preco');
                    await AsyncStorage.removeItem('data');

                    // update local state
                    setProdutos([]);
                    setPrecos([]);
                    setdata([]);
                    setTotal(0);
                    alert('Compra concluída');
                } catch (error) {
                    console.error('Erro ao confirmar compra:', error);
                    alert('Erro ao confirmar compra');
                }
            } else {
                alert("Valor insuficiente!!")
                return;
            }
        })();
    }
    useEffect(() => {
        carregarHistorico();
        const interval = setInterval(() => {
            setTime(prev => prev + 1);
            carregarHistorico();
        }, 5000);
        return () => {
            clearInterval(interval);

        }
    }, [])

    function calcularTotal() {
        const soma = precos.reduce((acc, curr) => acc + parseFloat(curr), 0)
        setTotal(soma);
    }
    useEffect(() => {
        calcularTotal();
    }, [precos]);
    return (
        <Animatable.View animation="fadeInLeft" style={[styles.container, { backgroundColor: theme.background }]}>

            <View style={[styles.container, { backgroundColor: theme.background }]}>
                <Text style={[styles.title, { color: theme.text }]}>Carrinho</Text>
                <Text style={[styles.text, { color: theme.text }]}>Saldo:R${Valor}</Text>
                <FlatList
                    data={produtos.map((produto, index,) => ({
                        produto,
                        preco: precos[index],
                        data
                    }))}
                    keyExtractor={(_, index) => index.toString()}
                    renderItem={({ item }) => (
                        <View style={[styles.itemContainer, { backgroundColor: theme.background }]}>
                            <Text style={[styles.text, { color: theme.text }]}>Produto: {item.produto}</Text>
                            <Text style={[styles.text, { color: theme.text }]}>Preço: R$ {item.preco}</Text>
                        </View>
                    )} />
                <NewButton children={"Comprar"} onPress={() => {
                    Comprar()
                }
                } />
                <Text style={[styles.text, { color: theme.text }]} >Total:R${total}</Text>
            </View>
        </Animatable.View >

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        height: '100%',
    },
    itemContainer: {
        backgroundColor: '#f8f9fa',
        padding: 15,
        marginVertical: 5,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#dee2e6',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    text: {
        fontSize: 16,
        color: 'black',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    butao: {
        alignItems: 'center',
        width: 100,
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 5,
        margin: 10,
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 5,
    },
});
