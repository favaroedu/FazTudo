import React, { useState, useEffect } from "react";

import {
  View,
  Text,
  StyleSheet,
  Alert,
  ScrollView,
  TouchableOpacity,
} from "react-native";

import Button from "../components/Button";
import Input from "../components/Input";
import { Picker } from "@react-native-picker/picker";
import { SafeAreaView } from "react-native-safe-area-context";

import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../services/firebaseConfig";

import AppHeader from "../components/AppHeader";

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
  const [experiencia, setExperiencia] = useState("");
  const [numeroEhWhatsapp, setNumeroEhWhatsapp] = useState(true);
  const [sobreMim, setSobreMim] = useState("");

  const [enderecoEncontrado, setEnderecoEncontrado] = useState(false);
  const [ultimoCepBuscado, setUltimoCepBuscado] = useState("");
  const [carregando, setCarregando] = useState(false);

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

  const formatarTelefone = (numero) => {
    const limpo = numero.replace(/\D/g, "");

    if (limpo.length === 11) {
      return `(${limpo.slice(0, 2)}) ${limpo.slice(2, 7)}-${limpo.slice(7)}`;
    }

    if (limpo.length === 10) {
      return `(${limpo.slice(0, 2)}) ${limpo.slice(2, 6)}-${limpo.slice(6)}`;
    }

    return numero;
  };

  const telefoneLimpo = telefone.replace(/\D/g, "");
  const emailFormatado = email.trim().toLowerCase();

  const camposValidos =
    nome.trim() &&
    rg.trim() &&
    cpf.trim() &&
    servico.trim() &&
    experiencia.trim() &&
    cep.replace(/\D/g, "").length === 8 &&
    enderecoEncontrado &&
    numero.trim() &&
    ddd.trim().length === 2 &&
    telefoneLimpo.length >= 8 &&
    telefoneLimpo.length <= 9 &&
    emailFormatado &&
    senha.trim() &&
    validarSenha(senha) &&
    confirmarSenha.trim() &&
    senha === confirmarSenha;

  const handleSubmit = async () => {
    if (!camposValidos) {
      Alert.alert("Erro", "Preencha todos os campos corretamente.");
      return;
    }

    setCarregando(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        emailFormatado,
        senha
      );

      const user = userCredential.user;

      const enderecoCompleto = `${logradouro}, ${numero} - ${bairro}, ${cidade} - ${estadoExtenso}`;
      const telefoneCompleto = formatarTelefone(`${ddd}${telefoneLimpo}`);

      const dadosProfissional = {
        uid: user.uid,
        tipo: "profissional",
        nome: nome.trim(),
        rg: rg.trim(),
        cpf: cpf.trim(),

        servico,
        experiencia: experiencia.trim(),
        sobreMim: sobreMim.trim(),

        cep: cep.replace(/\D/g, ""),
        endereco: enderecoCompleto,
        logradouro,
        numero,
        referencia: referencia.trim(),
        bairro,
        cidade,
        uf,
        estado: estadoExtenso,

        telefone: telefoneCompleto,
        possuiWhatsapp: numeroEhWhatsapp,
        whatsapp: numeroEhWhatsapp ? telefoneCompleto : "",

        ddd,
        email: emailFormatado,
        criadoEm: serverTimestamp(),
      };

      await setDoc(doc(db, "users", user.uid), dadosProfissional);

      Alert.alert("Sucesso", "Cadastro profissional realizado com sucesso!");
      goTo("homeProfissional");
    } catch (error) {
      console.log("Erro ao cadastrar profissional:", error);

      let mensagem = "Não foi possível realizar o cadastro.";

      if (error.code === "auth/email-already-in-use") {
        mensagem = "Este email já está cadastrado.";
      }

      if (error.code === "auth/invalid-email") {
        mensagem = "Email inválido.";
      }

      if (error.code === "auth/weak-password") {
        mensagem = "A senha é muito fraca.";
      }

      Alert.alert("Erro", mensagem);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <AppHeader
        title="Cadastro Profissional"
        subtitle="Crie sua conta para oferecer serviços"
        showBack
        onBack={() => goTo("chooseRegister")}
        backgroundColor="#0A2F73"
      />

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
          <Text style={styles.sectionTitle}>Apresentação profissional</Text>

          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={experiencia}
              onValueChange={setExperiencia}
              style={styles.picker}
            >
              <Picker.Item label="Tempo de experiência *" value="" />
              <Picker.Item label="Menos de 1 ano" value="Menos de 1 ano" />
              <Picker.Item label="1 a 3 anos" value="1 a 3 anos" />
              <Picker.Item label="3 a 5 anos" value="3 a 5 anos" />
              <Picker.Item label="5 a 10 anos" value="5 a 10 anos" />
              <Picker.Item label="Mais de 10 anos" value="Mais de 10 anos" />
            </Picker>
          </View>

          <Input
            placeholder="Fale um pouco sobre você e seus serviços"
            value={sobreMim}
            onChangeText={setSobreMim}
            multiline
          />

          <Text style={styles.helperText}>
            Essas informações aparecerão no seu perfil profissional.
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

          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => setNumeroEhWhatsapp(!numeroEhWhatsapp)}
          >
            <View
              style={[
                styles.checkbox,
                numeroEhWhatsapp && styles.checkboxChecked,
              ]}
            >
              {numeroEhWhatsapp && (
                <Text style={styles.checkboxMark}>✓</Text>
              )}
            </View>

            <Text style={styles.checkboxText}>
              Este número também é WhatsApp
            </Text>
          </TouchableOpacity>

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
            title={carregando ? "Criando conta..." : "Criar conta profissional"}
            onPress={handleSubmit}
            disabled={!camposValidos || carregando}
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

  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: -4,
    marginBottom: 12,
  },

  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#0A2F73",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },

  checkboxChecked: {
    backgroundColor: "#0A2F73",
  },

  checkboxMark: {
    color: "#fff",
    fontWeight: "900",
    fontSize: 14,
  },

  checkboxText: {
    color: "#555",
    fontSize: 13,
  },

  actions: {
    marginTop: 6,
  },
});