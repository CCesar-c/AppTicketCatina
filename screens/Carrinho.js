import React, { useEffect, useState, useContext } from 'react';
import { ThemeContext } from '../contexts/themeContext';
import { MoneyContext } from '../contexts/ContextMoney'
import { StyleSheet, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NewButton from '../components/componets';
import * as Animatable from 'react-native-animatable';
import { supabase } from '../Back-end/supabase';
import { ScrollView } from 'react-native';


export default function Carrinho() {
    const { theme } = useContext(ThemeContext);
    const [produtos, setProdutos] = useState([])
    const [precos, setPrecos] = useState([])
    const [data, setdata] = useState([])
    const [tabelas, setTabelas] = useState([]);
    const [_, setTime] = useState(0);
    const [total, setTotal] = useState(0);
    const { Valor } = useContext(MoneyContext);

    const carregarHistorico = async () => {
        try {
            const produtosStorage = await AsyncStorage.getItem('produto');
            const precosStorage = await AsyncStorage.getItem('preco');
            const dataStorage = await AsyncStorage.getItem('data');
            const tabelasStorage = await AsyncStorage.getItem('tabela');

            if (tabelasStorage) {
                setTabelas(JSON.parse(tabelasStorage));
            }

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

    async function AtualizarProdutos(NomeProduto, NomeTabela) {
        try {
            const { data: produtoAtual } = await supabase
                .from(NomeTabela)
                .select('Vendas, Estoque')
                .eq('Nome', NomeProduto)
                .single();

            await supabase
                .from(NomeTabela)
                .update({
                    Vendas: produtoAtual.Vendas + 1,
                    Estoque: produtoAtual.Estoque - 1,
                })
                .eq('Nome', NomeProduto);

        }
        catch (error) {
            console.error('Erro ao atualizar estoque:', error);
        }
    }

    function Comprar() {
        (async () => {
            if (Valor >= total) {
                try {
                    // read current cart
                    const storedEmail = await AsyncStorage.getItem('Email');

                    const produtosStorage = await AsyncStorage.getItem('produto');
                    const precosStorage = await AsyncStorage.getItem('preco');
                    const tabelasStorage = await AsyncStorage.getItem('tabela');

                    const produtosArr = produtosStorage ? JSON.parse(produtosStorage) : [];
                    const precosArr = precosStorage ? JSON.parse(precosStorage) : [];
                    const tabelasArr = tabelasStorage ? JSON.parse(tabelasStorage) : [];

                    // build historico entries
                    const fecha = new Date().toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'medium' });
                    const novos = produtosArr.map((p, i) => ({ produto: p, preco: precosArr[i], data: fecha }));

                    for (let i = 0; i < produtosArr.length; i++) {
                        await AtualizarProdutos(produtosArr[i], tabelasArr[i]);
                    }

                    //  append to existing historico
                    const historicoStorage = await AsyncStorage.getItem(`historico${storedEmail}`);
                    const historicoArr = historicoStorage ? JSON.parse(historicoStorage) : [];
                    const updatedHistorico = [...historicoArr, ...novos];
                    await AsyncStorage.setItem(`historico${storedEmail}`, JSON.stringify(updatedHistorico));

                    //update Valor

                    const novoValor = parseFloat(Valor) - parseFloat(total || 0);
                    await supabase
                        .from("users")
                        .update({ money: novoValor })
                        .eq("Emails", storedEmail);

                    //clear cart
                    await AsyncStorage.removeItem('produto');
                    await AsyncStorage.removeItem('preco');
                    await AsyncStorage.removeItem('data');
                    await AsyncStorage.removeItem('tabela');


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
        <View style={{ flex: 1, height: '100%'}}>
            <Animatable.View
                animation="fadeInLeft"
                style={{ flex: 1, backgroundColor: theme.background }}
            >

                {/* CABEÇALHO */}

                <View style={{ flexDirection: 'row', gap: 10, padding: 10 }} >
                    <Text style={[styles.title, { color: theme.text }]}>Carrinho</Text>
                    <Text style={[styles.text, { color: theme.text }]}>Saldo: R${Valor}</Text>
                    <NewButton children={"Comprar"} onPress={Comprar} />

                    <NewButton
                        children={"Limpar Carrinho"}
                        onPress={async () => {
                            await AsyncStorage.multiRemove([
                                "produto",
                                "preco",
                                "data",
                                "tabela",
                            ]);
                            setProdutos([]);
                            setPrecos([]);
                            setdata([]);
                            setTotal(0);
                        }}
                    />

                    <Text style={[styles.text, { color: theme.text }]}>
                        Total: R${total}
                    </Text>
                </View>
                <ScrollView
                    showsVerticalScrollIndicator={true}
                    style={{ flex: 1 }}
                    contentContainerStyle={styles.container}
                >
                    {produtos.map((produto, index) => (
                        <View
                            key={index}
                            style={[
                                styles.itemContainer,
                                { backgroundColor: theme.background, flexDirection: 'row', gap: 10, padding: 10 }

                            ]}
                        >
                            <Text style={[styles.text, { color: theme.text }]}>
                                Produto: {produto}
                            </Text>

                            <Text style={[styles.text, { color: theme.text }]}>
                                Preço: R$ {precos[index]}
                            </Text>
                        </View>
                    ))}
                </ScrollView>
            </Animatable.View>
        </View>

    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 10,
    },
    itemContainer: {
        height: 40,

        alignItems: 'center',
        flexDirection: 'row',
        padding: 15,
        marginBottom: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#dee2e6",
    },
    text: {
        fontSize: 16,
        color: "black",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
    },
    butao: {
        alignItems: "center",
        width: 100,
        backgroundColor: "white",
        padding: 10,
        borderRadius: 5,
        margin: 10,
        borderWidth: 1,
        borderColor: "black",
    },
});