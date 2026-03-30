import React, { useState } from "react";
import { View, Text, StyleSheet, Alert, ScrollView } from "react-native";
import Button from "../components/Button";
import Input from "../components/Input";
import { Picker } from "@react-native-picker/picker";
import { TextInputMask } from "react-native-masked-text";
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function RegisterAutonomoScreen({ goTo }) {
  const [nome, setNome] = useState("");
  const [rg, setRg] = useState("");
  const [cpf, setCpf] = useState("");
  const [cep, setCep] = useState("");
  const [numero, setNumero] = useState("");
  const [logradouro, setLogradouro] = useState("");
  const [bairro, setBairro] = useState("");
  const [cidade, setCidade] = useState("");
  const [uf, setUf] = useState("");
  const [ddd, setDdd] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [servico, setServico] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const servicos = [
    "Pedreiro", "Eletricista", "Pintor", "Encanador", "Jardineiro", "Diarista",
    "Técnico de Informática", "Técnico de Internet", "Vidraceiro", "Marceneiro",
    "Técnico em ar-condicionado", "Gesseiro", "Costureira",
  ];

  const servicosOrdenados = servicos.sort((a, b) =>
    a.localeCompare(b, "pt-BR", { sensitivity: "base" })
  );

  const validarSenha = (senha) => {
    if (!senha || senha.length < 8) return false;
    const regex = /^(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$/;
    return regex.test(senha);
  };

  const telefoneLimpo = telefone.replace(/\D/g, "");
  const camposValidos =
    nome.trim() &&
    rg.trim() &&
    cpf.trim() &&
    cep.trim() &&
    numero.trim() &&
    logradouro.trim() &&
    bairro.trim() &&
    cidade.trim() &&
    uf.trim() &&
    ddd.trim().length === 2 &&
    telefoneLimpo.length >= 8 &&
    telefoneLimpo.length <= 9 &&
    email.trim() &&
    senha.trim() &&
    validarSenha(senha) &&
    confirmarSenha.trim() &&
    senha === confirmarSenha &&
    servico.trim();

  const buscarEndereco = async () => {
    const cepLimpo = cep.replace(/\D/g, "");
    if (cepLimpo.length !== 8) return;

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      const data = await response.json();

      if (data.erro) {
        Alert.alert("CEP inválido", "Não foi possível encontrar o endereço.");
        return;
      }

      setLogradouro(data.logradouro);
      setBairro(data.bairro);
      setCidade(data.localidade);
      setUf(data.uf);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível buscar o endereço.");
    }
  };

  const handleSubmit = async () => {
    if (!camposValidos) {
      Alert.alert("Erro", "Preencha todos os campos corretamente.");
      return;
    }

    if (senha !== confirmarSenha) {
      Alert.alert("Erro", "As senhas não coincidem.");
      return;
    }

    const enderecoCompleto = `${logradouro}, ${numero} - ${bairro}, ${cidade} - ${uf}`;
    const telefoneCompleto = `(${ddd}) ${telefone}`;

    const dados = {
      nome,
      rg,
      cpf,
      endereco: enderecoCompleto,
      telefone: telefoneCompleto,
      email: email.toLowerCase(),
      senha,
      servico,
    };

    try {
      const profissionaisExistentes = JSON.parse(await AsyncStorage.getItem("profissionais")) || [];
      profissionaisExistentes.push(dados);
      await AsyncStorage.setItem("profissionais", JSON.stringify(profissionaisExistentes));

      console.log("Profissional salvo:", dados);
      Alert.alert("Sucesso", "Cadastro realizado com sucesso!");
      goTo("chooseRegister");
    } catch (error) {
      console.error("Erro ao salvar profissional:", error);
      Alert.alert("Erro", "Não foi possível salvar o cadastro.");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Cadastro de Profissional</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.asterisco}>* Campos obrigatórios</Text>

        {/* Inputs iguais ao seu código */}
        {/* ... */}

        <Button title="Cadastrar" onPress={handleSubmit} disabled={!camposValidos} />
        <Button title="Voltar" onPress={() => goTo("chooseRegister")} type="secondary" />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // estilos iguais ao seu código
});
