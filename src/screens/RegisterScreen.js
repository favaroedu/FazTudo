import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Alert, ScrollView } from "react-native";
import Button from "../components/Button";
import Input from "../components/Input";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function RegisterScreen({ goTo }) {
  const [nome, setNome] = useState("");
  const [rg, setRg] = useState("");
  const [cpf, setCpf] = useState("");

  const [cep, setCep] = useState("");
  const [numero, setNumero] = useState("");
  const [referencia, setReferencia] = useState("");

  const [logradouro, setLogradouro] = useState("");
  const [bairro, setBairro] = useState("");
  const [cidade, setCidade] = useState("");
  const [uf, setUf] = useState("");
  const [estadoExtenso, setEstadoExtenso] = useState("");

  const [ddd, setDdd] = useState("");
  const [telefone, setTelefone] = useState("");

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const [enderecoEncontrado, setEnderecoEncontrado] = useState(false);
  const [ultimoCepBuscado, setUltimoCepBuscado] = useState("");

  const estados = {
    AC: "Acre",
    AL: "Alagoas",
    AP: "Amapá",
    AM: "Amazonas",
    BA: "Bahia",
    CE: "Ceará",
    DF: "Distrito Federal",
    ES: "Espírito Santo",
    GO: "Goiás",
    MA: "Maranhão",
    MT: "Mato Grosso",
    MS: "Mato Grosso do Sul",
    MG: "Minas Gerais",
    PA: "Pará",
    PB: "Paraíba",
    PR: "Paraná",
    PE: "Pernambuco",
    PI: "Piauí",
    RJ: "Rio de Janeiro",
    RN: "Rio Grande do Norte",
    RS: "Rio Grande do Sul",
    RO: "Rondônia",
    RR: "Roraima",
    SC: "Santa Catarina",
    SP: "São Paulo",
    SE: "Sergipe",
    TO: "Tocantins",
  };

  const limparEndereco = () => {
    setEnderecoEncontrado(false);
    setLogradouro("");
    setBairro("");
    setCidade("");
    setUf("");
    setEstadoExtenso("");
  };

  const buscarEndereco = async (cepLimpo) => {
    try {
      const response = await fetch(
        `https://viacep.com.br/ws/${cepLimpo}/json/`
      );

      const data = await response.json();

      if (data.erro) {
        limparEndereco();
        Alert.alert("CEP inválido");
        return;
      }

      setLogradouro(data.logradouro || "");
      setBairro(data.bairro || "");
      setCidade(data.localidade || "");
      setUf(data.uf || "");
      setEstadoExtenso(estados[data.uf] || data.uf);

      setEnderecoEncontrado(true);
    } catch (error) {
      console.log("Erro ViaCEP:", error);
      limparEndereco();
      Alert.alert("Erro", "Falha ao buscar CEP.");
    }
  };

  useEffect(() => {
    const cepLimpo = cep.replace(/\D/g, "");

    if (cepLimpo.length !== 8) {
      limparEndereco();
      setUltimoCepBuscado("");
      return;
    }

    if (cepLimpo === ultimoCepBuscado) return;

    setUltimoCepBuscado(cepLimpo);
    buscarEndereco(cepLimpo);
  }, [cep]);

  const validarSenha = (senha) => {
    const regex = /^(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$/;
    return regex.test(senha);
  };

  const telefoneLimpo = telefone.replace(/\D/g, "");

  const camposValidos =
    nome.trim() &&
    rg.trim() &&
    cpf.trim() &&
    cep.replace(/\D/g, "").length === 8 &&
    enderecoEncontrado &&
    numero.trim() &&
    ddd.trim().length === 2 &&
    telefoneLimpo.length >= 8 &&
    telefoneLimpo.length <= 9 &&
    email.trim() &&
    senha.trim() &&
    validarSenha(senha) &&
    confirmarSenha.trim() &&
    senha === confirmarSenha;

  const handleSubmit = async () => {
    if (!camposValidos) {
      Alert.alert("Erro", "Preencha todos os campos corretamente.");
      return;
    }

    const enderecoCompleto = `${logradouro}, ${numero} - ${bairro}, ${cidade} - ${estadoExtenso}`;
    const telefoneCompleto = `(${ddd}) ${telefoneLimpo}`;

    const dados = {
      nome,
      rg,
      cpf,
      endereco: enderecoCompleto,
      referencia,
      telefone: telefoneCompleto,
      email: email.toLowerCase(),
      senha,
    };

    try {
      const data = await AsyncStorage.getItem("usuarios");
      let usuariosExistentes = data ? JSON.parse(data) : [];

      usuariosExistentes.push(dados);

      await AsyncStorage.setItem(
        "usuarios",
        JSON.stringify(usuariosExistentes)
      );

      Alert.alert("Sucesso", "Cadastro realizado com sucesso!");
      goTo("chooseRegister");
    } catch (error) {
      Alert.alert("Erro", "Não foi possível salvar o cadastro.");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Cadastro de Usuário</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.asterisco}>* Campos obrigatórios</Text>

        <Input placeholder="Nome completo *" value={nome} onChangeText={setNome} />
        <Input placeholder="RG *" value={rg} onChangeText={setRg} />
        <Input placeholder="CPF *" value={cpf} onChangeText={setCpf} />

        <Input
          placeholder="CEP *"
          value={cep}
          onChangeText={setCep}
          keyboardType="numeric"
        />

        {enderecoEncontrado && (
          <>
            <View style={styles.row}>
              <View style={styles.flex2}>
                <Input
                  placeholder="Logradouro *"
                  value={logradouro}
                  onChangeText={setLogradouro}
                />
              </View>

              <View style={styles.flex1}>
                <Input
                  placeholder="Número *"
                  value={numero}
                  onChangeText={setNumero}
                />
              </View>
            </View>

            <Input
              placeholder="Referência (opcional)"
              value={referencia}
              onChangeText={setReferencia}
            />

            <View style={styles.row}>
              <View style={styles.flex1}>
                <Input
                  placeholder="Bairro *"
                  value={bairro}
                  onChangeText={setBairro}
                />
              </View>

              <View style={styles.flex1}>
                <Input
                  placeholder="Cidade *"
                  value={cidade}
                  onChangeText={setCidade}
                />
              </View>
            </View>

            <Input
              placeholder="Estado"
              value={estadoExtenso}
              editable={false}
            />
          </>
        )}

        <Input placeholder="DDD *" value={ddd} onChangeText={setDdd} keyboardType="numeric" />

        <Input
          placeholder="Telefone *"
          value={telefone}
          onChangeText={setTelefone}
          keyboardType="phone-pad"
        />

        <Input placeholder="Email *" value={email} onChangeText={setEmail} />

        <Input
          placeholder="Senha *"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
        />

        <Input
          placeholder="Confirmar senha *"
          value={confirmarSenha}
          onChangeText={setConfirmarSenha}
          secureTextEntry
        />

        <Button title="Cadastrar" onPress={handleSubmit} disabled={!camposValidos} />

        <Button
          title="Voltar"
          onPress={() => goTo("chooseRegister")}
          type="secondary"
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    padding: 16,
    backgroundColor: "#fff",
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  container: {
    padding: 16,
  },
  asterisco: {
    marginBottom: 10,
    color: "red",
  },
  row: {
    flexDirection: "row",
    gap: 10,
  },
  flex1: {
    flex: 1,
  },
  flex2: {
    flex: 2,
  },
});