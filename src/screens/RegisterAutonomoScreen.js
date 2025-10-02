import React, { useState } from "react";
import { View, Text, StyleSheet, Alert, ScrollView } from "react-native";
import Button from "../components/Button";
import Input from "../components/Input";
import { Picker } from "@react-native-picker/picker";

export default function RegisterAutonomoScreen({ goTo }) {
  const [nome, setNome] = useState("");
  const [rg, setRg] = useState("");
  const [cpf, setCpf] = useState("");
  const [endereco, setEndereco] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [servico, setServico] = useState("");

  const servicos = [
    "Pedreiro",
    "Eletricista",
    "Pintor",
    "Encanador",
    "Jardineiro",
    "Diarista",
    "Técnico de Informática",
    "Técnico de Internet",
    "Vidraceiro",
    "Marceneiro",
    "Técnico em ar-condicionado",
    "Gesseiro",
    "Costureira",
  ];

  const servicosOrdenados = servicos.sort((a, b) =>
    a.localeCompare(b, "pt-BR", { sensitivity: "base" })
  );

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
      <View style={styles.header}>
  <Text style={styles.headerText}>Cadastro de Profissional</Text>
</View>
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
        <Picker.Item label="Selecione um serviço..." value="" />
        {servicosOrdenados.map((item) => (
          <Picker.Item key={item} label={item} value={item} />
        ))}
      </Picker>
      <Button title="Cadastrar" onPress={handleSubmit} />
      <Button title="Voltar" onPress={() => goTo("chooseRegister")} type="secondary" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
  backgroundColor: "#ff9900ff", 
  paddingVertical: 12,
  paddingHorizontal: 20,
  borderRadius: 8,
  marginBottom: 20,
  alignItems: "center",
},

headerText: {
  color: "#fff",
  fontSize: 22,
  fontWeight: "bold",
},

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
