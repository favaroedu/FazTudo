import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Alert, ScrollView } from "react-native";
import Button from "../components/Button";
import Input from "../components/Input";
import { Picker } from "@react-native-picker/picker";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function RegisterAutonomoScreen({ goTo }) {
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

  const [servico, setServico] = useState("");

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

  const servicos = [
    "Construção",
    "Reformas",
    "Pintura",
    "Elétrica",
    "Hidráulica",
    "Marcenaria",
    "Vidraçaria",
    "Gesso e Drywall",
    "Climatização",
    "Jardinagem",
    "Limpeza residencial",
    "Montagem de móveis",
    "Serralheria",
    "Dedetização",
    "Segurança eletrônica",
    "Energia solar",
    "Piscinas",
    "Informática",
    "Internet e Redes",
    "Instalações",
  ].sort((a, b) => a.localeCompare(b, "pt-BR", { sensitivity: "base" }));

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
        Alert.alert("CEP inválido", "Não encontramos esse CEP.");
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
    servico.trim() &&
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
      servico,
      endereco: enderecoCompleto,
      referencia,
      telefone: telefoneCompleto,
      email: email.toLowerCase(),
      senha,
    };

    try {
      const data = await AsyncStorage.getItem("profissionais");
      let profissionaisExistentes = data ? JSON.parse(data) : [];

      profissionaisExistentes.push(dados);

      await AsyncStorage.setItem(
        "profissionais",
        JSON.stringify(profissionaisExistentes)
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
        <Text style={styles.headerTitle}>Cadastro de Profissional</Text>
        <Text style={styles.headerSubtitle}>
          Informe seus dados e escolha sua área de atuação.
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.requiredText}>* Campos obrigatórios</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dados pessoais</Text>

          <Input
            placeholder="Nome completo *"
            value={nome}
            onChangeText={setNome}
          />

          <Input placeholder="RG *" value={rg} onChangeText={setRg} />

          <Input
            placeholder="CPF *"
            value={cpf}
            onChangeText={setCpf}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Área de atuação</Text>

          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={servico}
              onValueChange={setServico}
              style={styles.picker}
            >
              <Picker.Item label="Selecione sua área de serviço *" value="" />
              {servicos.map((item) => (
                <Picker.Item key={item} label={item} value={item} />
              ))}
            </Picker>
          </View>

          <Text style={styles.helperText}>
            Escolha a categoria principal do serviço que você oferece.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Endereço</Text>

          <Input
            placeholder="CEP *"
            value={cep}
            onChangeText={setCep}
            keyboardType="numeric"
          />

          {!enderecoEncontrado && cep.replace(/\D/g, "").length > 0 && (
            <Text style={styles.helperText}>
              Digite os 8 números do CEP para buscarmos seu endereço.
            </Text>
          )}

          {enderecoEncontrado && (
            <>
              <Text style={styles.successText}>Endereço encontrado ✓</Text>

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
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contato</Text>

          <View style={styles.row}>
            <View style={styles.dddBox}>
              <Input
                placeholder="DDD *"
                value={ddd}
                onChangeText={setDdd}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.phoneBox}>
              <Input
                placeholder="Telefone *"
                value={telefone}
                onChangeText={setTelefone}
                keyboardType="phone-pad"
              />
            </View>
          </View>

          <Input
            placeholder="Email *"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Acesso</Text>

          <Input
            placeholder="Senha *"
            value={senha}
            onChangeText={setSenha}
            secureTextEntry
          />

          <Text style={styles.helperText}>
            A senha deve ter no mínimo 8 caracteres, 1 número e 1 caractere
            especial.
          </Text>

          <Input
            placeholder="Confirmar senha *"
            value={confirmarSenha}
            onChangeText={setConfirmarSenha}
            secureTextEntry
          />

          {confirmarSenha.length > 0 && senha !== confirmarSenha && (
            <Text style={styles.errorText}>As senhas não coincidem.</Text>
          )}
        </View>

        <View style={styles.actions}>
          <Button
            title="Criar conta profissional"
            onPress={handleSubmit}
            disabled={!camposValidos}
          />

          <Button
            title="Voltar"
            onPress={() => goTo("chooseRegister")}
            type="secondary"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },

  header: {
    paddingHorizontal: 22,
    paddingTop: 18,
    paddingBottom: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f1f1f1",
  },

  headerTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#0A2F73",
    marginBottom: 4,
  },

  headerSubtitle: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },

  container: {
    padding: 22,
    paddingBottom: 35,
  },

  requiredText: {
    color: "#ff8c1a",
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 14,
  },

  section: {
    marginBottom: 22,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0A2F73",
    marginBottom: 12,
  },

  helperText: {
    color: "#777",
    fontSize: 12,
    lineHeight: 18,
    marginTop: -4,
    marginBottom: 10,
  },

  successText: {
    color: "#198754",
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 10,
  },

  errorText: {
    color: "#d93025",
    fontSize: 12,
    marginTop: -4,
    marginBottom: 8,
  },

  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    backgroundColor: "#fff",
    marginBottom: 10,
    overflow: "hidden",
  },

  picker: {
    height: 52,
    color: "#333",
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

  dddBox: {
    flex: 0.35,
  },

  phoneBox: {
    flex: 1,
  },

  actions: {
    marginTop: 6,
  },
});