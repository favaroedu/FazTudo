import React, { useState } from "react";
import { View, Text, StyleSheet, Alert, ScrollView, TextInput } from "react-native";
import Button from "../components/Button";
import Input from "../components/Input";
import { Picker } from '@react-native-picker/picker';


export default function RegisterAutonomoScreen({ goTo }) {
  const [nome, setNome] = useState("");
  const [rg, setRg] = useState("");
  const [cpf, setCpf] = useState("");
  const [endereco, setEndereco] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [servico, setServico] = useState("Pedreiro");

  const validarSenha = (senha) => {
    const regex = /^(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$/;
    return regex.test(senha);
  };

  const handleSubmit = () => {
    if (
      !nome ||
      !rg ||
      !cpf ||
      !endereco ||
      !telefone ||
      !email ||
      !senha ||
      !servico
    ) {
      Alert.alert("Erro", "Preencha todos os campos.");
      return;
    }

    if (!validarSenha(senha)) {
      Alert.alert(
        "Senha inválida",
        "A senha deve ter no mínimo 8 caracteres, incluindo pelo menos 1 número e 1 caractere especial."
      );
      return;
    }

    const dados = {
      nome,
      rg,
      cpf,
      endereco,
      telefone,
      email,
      senha,
      servico,
    };

    console.log("Dados enviados:", dados);
    Alert.alert("Sucesso", "Cadastro realizado com sucesso!");
    goTo("chooseRegister");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Cadastro de Profissional</Text>
      <Input placeholder="Nome completo" value={nome} onChangeText={setNome} />
      <Input placeholder="RG" value={rg} onChangeText={setRg} />
      <Input placeholder="CPF" value={cpf} onChangeText={setCpf} />
      <Input placeholder="Endereço" value={endereco} onChangeText={setEndereco} />
      <Input placeholder="Telefone" value={telefone} onChangeText={setTelefone} />
      <Input placeholder="Email" value={email} onChangeText={setEmail} />
      <Input
        placeholder="Senha"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
      />
      <Text style={styles.label}>Serviço oferecido:</Text>
      <Picker
        selectedValue={servico}
        style={styles.picker}
        onValueChange={(itemValue) => setServico(itemValue)}
      >
        <Picker.Item label="Pedreiro" value="Pedreiro" />
        <Picker.Item label="Eletricista" value="Eletricista" />
        <Picker.Item label="Pintor" value="Pintor" />
        <Picker.Item label="Encanador" value="Encanador" />
      </Picker>
      <Button title="Cadastrar" onPress={handleSubmit} />
      <Button title="Voltar" onPress={() => goTo("chooseRegister")} type="secondary" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    flexGrow: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  label: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "600",
  },
  picker: {
    height: 50,
    width: "100%",
    marginBottom: 20,
  },
});
