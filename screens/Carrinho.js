import React, { useEffect, useState, useContext } from 'react';
import { ThemeContext } from '../contexts/themeContext';
import { MoneyContext } from '../contexts/ContextMoney';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Animatable from 'react-native-animatable';
import { supabase } from '../Back-end/supabase';

export default function Carrinho() {
    const { theme } = useContext(ThemeContext);
    const { Valor } = useContext(MoneyContext);

    const [produtos, setProdutos] = useState([]);
    const [precos, setPrecos] = useState([]);
    const [tabelas, setTabelas] = useState([]);
    const [total, setTotal] = useState(0);

    // Carregar itens do carrinho do AsyncStorage
    const carregarHistorico = async () => {
        try {
            const produtosStorage = await AsyncStorage.getItem('produto');
            const precosStorage = await AsyncStorage.getItem('preco');
            const tabelasStorage = await AsyncStorage.getItem('tabela');

            setProdutos(produtosStorage ? JSON.parse(produtosStorage) : []);
            setPrecos(precosStorage ? JSON.parse(precosStorage) : []);
            setTabelas(tabelasStorage ? JSON.parse(tabelasStorage) : []);
        } catch (error) {
            console.error('Erro ao carregar histórico:', error);
        }
    };

    // Atualizar produto no supabase (Vendas e Estoque)
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

    // Comprar todos os itens
    function Comprar() {
        (async () => {
            if (Valor >= total) {
                try {
                    const storedEmail = await AsyncStorage.getItem('Email');

                    if (produtos.length === 0) {
                        alert("Carrinho está vazio!");
                        return;
                    }

                    const fecha = new Date().toLocaleString('pt-BR', {
                        dateStyle: 'short',
                        timeStyle: 'medium'
                    });

                    const novos = produtos.map((p, i) => ({
                        produto: p,
                        preco: precos[i],
                        data: fecha
                    }));

                    for (let i = 0; i < produtos.length; i++) {
                        await AtualizarProdutos(produtos[i], tabelas[i]);
                    }

                    const historicoStorage = await AsyncStorage.getItem(`historico${storedEmail}`);
                    const historicoArr = historicoStorage ? JSON.parse(historicoStorage) : [];
                    const updatedHistorico = [...historicoArr, ...novos];

                    await AsyncStorage.setItem(`historico${storedEmail}`, JSON.stringify(updatedHistorico));

                    const novoValor = parseFloat(Valor) - parseFloat(total || 0);
                    await supabase.from("users").update({ money: novoValor }).eq("Emails", storedEmail);

                    await AsyncStorage.multiRemove(["produto", "preco", "tabela"]);

                    setProdutos([]);
                    setPrecos([]);
                    setTabelas([]);
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

    // Remover item específico
    const removerItem = async (index) => {
        try {
            const novosProdutos = produtos.filter((_, i) => i !== index);
            const novosPrecos = precos.filter((_, i) => i !== index);
            const novasTabelas = tabelas.filter((_, i) => i !== index);

            setProdutos(novosProdutos);
            setPrecos(novosPrecos);
            setTabelas(novasTabelas);

            await AsyncStorage.setItem('produto', JSON.stringify(novosProdutos));
            await AsyncStorage.setItem('preco', JSON.stringify(novosPrecos));
            await AsyncStorage.setItem('tabela', JSON.stringify(novasTabelas));

            const soma = novosPrecos.reduce((acc, curr) => acc + parseFloat(curr), 0);
            setTotal(soma);
        } catch (error) {
            console.error('Erro ao remover item:', error);
        }
    };

    // Atualiza total sempre que precos mudarem
    useEffect(() => {
        const soma = precos.reduce((acc, curr) => acc + parseFloat(curr), 0);
        setTotal(soma);
    }, [precos]);

    useEffect(() => {
        carregarHistorico();
    }, []);

    return (
        <View style={{ flex: 1 }}>
            <Animatable.View animation="fadeInLeft" style={{ flex: 1, backgroundColor: theme.background }}>
                <View style={{ padding: 10 }}>
                    <Text style={[styles.title, { color: theme.text }]}>Carrinho</Text>
                    <Text style={[styles.text, { color: theme.text }]}>Saldo: R$ {Valor}</Text>
                </View>

                <ScrollView style={{ flex: 1, marginBottom: 150, backgroundColor: theme.background }}>
                    {produtos.map((produto, index) => (
                        <View key={index} style={[styles.itemContainer, { backgroundColor: theme.background }]}>
                            <Text style={[styles.text, { color: theme.text }]}>Produto: {produto}</Text>
                            <Text style={[styles.text, { color: theme.text }]}>Preço: R$ {precos[index]}</Text>
                            <TouchableOpacity
                                onPress={() => removerItem(index)}
                                style={{ backgroundColor: 'red', padding: 3, borderRadius: 5 }}
                            >
                                <Text style={{ color: 'white' }}>Remover</Text>
                            </TouchableOpacity>
                        </View>
                    ))}
                </ScrollView>
            </Animatable.View>

            <View style={{ backgroundColor: theme.background, position: "absolute", bottom: 0, left: 0, right: 0, borderTopWidth: 2, borderColor: "gray", padding: 15 }}>
                <Text style={{ color: theme.text, fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>Total: R$ {total}</Text>

                <View style={styles.buttonsRow}>
                    <TouchableOpacity style={styles.buttonBuy} onPress={Comprar}>
                        <Text style={styles.buttonText}>Comprar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.buttonClear}
                        onPress={async () => {
                            await AsyncStorage.multiRemove(["produto", "preco", "tabela"]);
                            setProdutos([]);
                            setPrecos([]);
                            setTabelas([]);
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
