import React, { useEffect, useState, useContext } from 'react';
import { ThemeContext } from '../contexts/themeContext';
import { MoneyContext } from '../contexts/ContextMoney';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Animatable from 'react-native-animatable';
import { supabase } from '../Back-end/supabase';

export default function Carrinho() {
    const { theme } = useContext(ThemeContext);
    const [produtos, setProdutos] = useState([]);
    const [precos, setPrecos] = useState([]);
    const [data, setdata] = useState([]);
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

            if (tabelasStorage) setTabelas(JSON.parse(tabelasStorage));
            if (produtosStorage) setProdutos(JSON.parse(produtosStorage));
            if (precosStorage) setPrecos(JSON.parse(precosStorage));
            if (dataStorage) setdata(dataStorage);

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
                    Estoque: produtoAtual.Estoque - 1
                })
                .eq('Nome', NomeProduto);

        } catch (error) {
            console.error('Erro ao atualizar estoque:', error);
        }
    }

    function Comprar() {
        (async () => {
            if (Valor >= total) {
                try {
                    const storedEmail = await AsyncStorage.getItem('Email');
                    const produtosStorage = await AsyncStorage.getItem('produto');
                    const precosStorage = await AsyncStorage.getItem('preco');
                    const tabelasStorage = await AsyncStorage.getItem('tabela');

                    const produtosArr = produtosStorage ? JSON.parse(produtosStorage) : [];
                    const precosArr = precosStorage ? JSON.parse(precosStorage) : [];
                    const tabelasArr = tabelasStorage ? JSON.parse(tabelasStorage) : [];

                    if (produtosArr.length === 0) {
                        alert("Carrinho está vazio!");
                        return;
                    }

                    const fecha = new Date().toLocaleString('pt-BR', {
                        dateStyle: 'short',
                        timeStyle: 'medium'
                    });

                    const novos = produtosArr.map((p, i) => ({
                        produto: p,
                        preco: precosArr[i],
                        data: fecha
                    }));

                    for (let i = 0; i < produtosArr.length; i++) {
                        await AtualizarProdutos(produtosArr[i], tabelasArr[i]);
                    }

                    const historicoStorage = await AsyncStorage.getItem(`historico${storedEmail}`);
                    const historicoArr = historicoStorage ? JSON.parse(historicoStorage) : [];
                    const updatedHistorico = [...historicoArr, ...novos];

                    await AsyncStorage.setItem(`historico${storedEmail}`, JSON.stringify(updatedHistorico));

                    const novoValor = parseFloat(Valor) - parseFloat(total || 0);

                    await supabase
                        .from("users")
                        .update({ money: novoValor })
                        .eq("Emails", storedEmail);

                    await AsyncStorage.multiRemove(["produto", "preco", "data", "tabela"]);

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
                alert("Valor insuficiente!!");
            }
        })();
    }

    useEffect(() => {
        carregarHistorico();
        const interval = setInterval(() => {
            setTime(prev => prev + 1);
            carregarHistorico();
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const soma = precos.reduce((acc, curr) => acc + parseFloat(curr), 0);
        setTotal(soma);
    }, [precos]);

    return (
        <View style={{ flex: 1 }}>
            <Animatable.View animation="fadeInLeft" style={{ flex: 1, backgroundColor: theme.background }}>

                {/* CABEÇALHO */}
                <View style={{ padding: 10 }}>
                    <Text style={[styles.title, { color: theme.text }]}>Carrinho</Text>
                    <Text style={[styles.text, { color: theme.text }]}>Saldo: R$ {Valor}</Text>
                </View>

                {/* LISTA DE ITENS */}
                <ScrollView style={{ flex: 1, marginBottom: 150 }}>
                    {produtos.map((produto, index) => (
                        <View key={index} style={[styles.itemContainer, { backgroundColor: theme.background }]}>
                            <Text style={[styles.text, { color: theme.text }]}>Produto: {produto}</Text>
                            <Text style={[styles.text, { color: theme.text }]}>Preço: R$ {precos[index]}</Text>
                        </View>
                    ))}
                </ScrollView>
            </Animatable.View>

            {/* ÁREA INFERIOR SEPARADA */}
            <View style={styles.bottomSection}>

                {/* TOTAL */}
                <Text style={styles.totalText}>Total: R$ {total}</Text>

                {/* BOTÕES */}
                <View style={styles.buttonsRow}>
                    <TouchableOpacity style={styles.buttonBuy} onPress={Comprar}>
                        <Text style={styles.buttonText}>Comprar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.buttonClear}
                        onPress={async () => {
                            await AsyncStorage.multiRemove(["produto", "preco", "data", "tabela"]);
                            setProdutos([]);
                            setPrecos([]);
                            setdata([]);
                            setTotal(0);
                        }}
                    >
                        <Text style={styles.buttonText}>Limpar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    itemContainer: {
        height: 53,
        alignItems: 'center',
        flexDirection: 'row',
        padding: 15,
        marginBottom: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#dee2e6",
        justifyContent: "space-between"
    },

    text: {
        fontSize: 16
    },

    title: {
        fontSize: 24,
        fontWeight: "bold"
    },

    /* ÁREA DIFERENCIADA INFERIOR */
    bottomSection: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "#f1f1f1",
        borderTopWidth: 2,
        borderColor: "#ccc",
        padding: 15
    },

    totalText: {
        color: "black",
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10
    },

    buttonsRow: {
        flexDirection: "row",
        width: "100%"
    },

    buttonBuy: {
        flex: 1,
        paddingVertical: 18,
        backgroundColor: "#5DADEC",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 5,
        marginRight: 5
    },

    buttonClear: {
        flex: 1,
        paddingVertical: 18,
        backgroundColor: "gray",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 5,
        marginLeft: 5
    },

    buttonText: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold"
    }
});
