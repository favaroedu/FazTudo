import React, { useState } from "react";
import { View, Text, StyleSheet, Alert, ScrollView } from "react-native";
import Button from "../components/Button";
import Input from "../components/Input";
import { Picker } from "@react-native-picker/picker";
import { TextInputMask } from "react-native-masked-text";
import { SafeAreaView } from 'react-native-safe-area-context';

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
    senha === confirmarSenha
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

  const handleSubmit = () => {
    if (!camposValidos) {
      Alert.alert("Erro", "Preencha todos os campos corretamente.");
      return;
    if (senha !== confirmarSenha) {
      Alert.alert("Erro", "As senhas não coincidem.");
      return;
}  
    }

    const enderecoCompleto = `${logradouro}, ${numero} - ${bairro}, ${cidade} - ${uf}`;
    const telefoneCompleto = `(${ddd}) ${telefone}`;

    const dados = {
      nome,
      rg,
      cpf,
      endereco: enderecoCompleto,
      telefone: telefoneCompleto,
      email,
      senha,
      servico,
    };

    console.log("Dados enviados:", dados);
    Alert.alert("Sucesso", "Cadastro realizado com sucesso!");
    goTo("chooseRegister");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Cadastro de Profissional</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.asterisco}>* Campos obrigatórios</Text>

        <Input placeholder="Nome completo *" value={nome} onChangeText={setNome} />
        <Input placeholder="RG *" value={rg} onChangeText={setRg} />
        <Input placeholder="CPF *" value={cpf} onChangeText={setCpf} />

        <View style={styles.row}>
          <View style={styles.cepContainer}>
            <Input
              placeholder="CEP *"
              value={cep}
              onChangeText={setCep}
              onBlur={buscarEndereco}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.numeroContainer}>
            <Input placeholder="Número *" value={numero} onChangeText={setNumero} />
          </View>
        </View>

        <Input placeholder="Logradouro *" value={logradouro} onChangeText={setLogradouro} />
        <Input placeholder="Bairro *" value={bairro} onChangeText={setBairro} />
        <Input placeholder="Cidade *" value={cidade} onChangeText={setCidade} />
        <Input placeholder="Estado (UF) *" value={uf} onChangeText={setUf} />

        <View style={styles.row}>
          <View style={styles.dddContainer}>
            <Text style={styles.label}>DDD: *</Text>
            <TextInputMask
              type={"custom"}
              options={{ mask: "99" }}
              value={ddd}
              onChangeText={setDdd}
              style={styles.input}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.telefoneContainer}>
            <Text style={styles.label}>Telefone: *</Text>
            <TextInputMask
              type={"cel-phone"}
              options={{
                maskType: "BRL",
                withDDD: false,
                dddMask: "(99) ",
              }}
              value={telefone}
              onChangeText={setTelefone}
              style={styles.input}
              keyboardType="phone-pad"
            />
          </View>
        </View>

        <Input placeholder="Email *" value={email} onChangeText={setEmail} />
        <Input placeholder="Senha *" value={senha} onChangeText={setSenha} secureTextEntry />
        <Input placeholder="Confirmar senha *" value={confirmarSenha} onChangeText={setConfirmarSenha} secureTextEntry/>

        <Text style={styles.label}>Serviço oferecido: *</Text>
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

        <Button title="Cadastrar" onPress={handleSubmit} disabled={!camposValidos} />
        <Button title="Voltar" onPress={() => goTo("chooseRegister")} type="secondary" />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    flexGrow: 1,
    justifyContent: "center",
  },
  header: {
    backgroundColor: "#ff9100ff",
    paddingVertical: 16,
    alignItems: "center",
    width: "100%",
  },
  headerText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
  },
  asterisco: {
  fontSize: 12,
  color: "#666",
  marginBottom: 10,
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
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  cepContainer: {
    flex: 1.2,
  },
  numeroContainer: {
    flex: 1,
  },
  dddContainer: {
    flex: 0.7,
  },
  telefoneContainer: {
    flex: 2,
  },
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
