import React, { useEffect, useState } from "react";

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import {
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";

import { auth, db } from "../services/firebaseConfig";

import { Picker } from "@react-native-picker/picker";

import AppHeader from "../components/AppHeader";
import Button from "../components/Button";
import Input from "../components/Input";

export default function EditProfessionalProfileScreen({ goTo }) {
  const [nome, setNome] = useState("");
  const [servico, setServico] = useState("");

  const [ddd, setDdd] = useState("");
  const [telefone, setTelefone] = useState("");

  const [experiencia, setExperiencia] = useState("");
  const [sobreMim, setSobreMim] = useState("");

  const carregarDados = async () => {
    try {
      const user = auth.currentUser;

      if (!user) return;

      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const dados = userSnap.data();

        setNome(dados.nome || "");
        setServico(dados.servico || "");

        setDdd(dados.ddd || "");
        setTelefone(dados.telefone || "");

        setExperiencia(dados.experiencia || "");
        setSobreMim(dados.sobreMim || "");
      }
    } catch (error) {
      console.log("Erro ao carregar perfil:", error);
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  const salvarPerfil = async () => {
    try {
      const user = auth.currentUser;

      if (!user) {
        Alert.alert("Erro", "Usuário não autenticado.");
        return;
      }

      await updateDoc(
        doc(db, "users", user.uid),
        {
          nome,
          servico,
          ddd,
          telefone,
          experiencia,
          sobreMim,
        }
      );

      Alert.alert(
        "Sucesso",
        "Perfil atualizado com sucesso!"
      );
    } catch (error) {
      console.log("Erro ao atualizar perfil:", error);

      Alert.alert(
        "Erro",
        "Não foi possível atualizar o perfil."
      );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <AppHeader
        title="Editar Perfil"
        subtitle="Atualize suas informações"
        showBack
        onBack={() => goTo("homeProfissional")}
        backgroundColor="#0A2F73"
      />

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>
            Informações profissionais
          </Text>

          <Input
            placeholder="Nome"
            value={nome}
            onChangeText={setNome}
          />

          <Input
            placeholder="Serviço"
            value={servico}
            onChangeText={setServico}
          />

          <Text style={styles.label}>
            Telefone / WhatsApp
          </Text>

          <View style={styles.row}>
            <View style={styles.dddContainer}>
              <Input
                placeholder="DDD"
                value={ddd}
                onChangeText={setDdd}
                keyboardType="numeric"
                maxLength={2}
              />
            </View>

            <View style={styles.phoneContainer}>
              <Input
                placeholder="99999-9999"
                value={telefone}
                onChangeText={setTelefone}
                keyboardType="numeric"
                maxLength={10}
              />
            </View>
          </View>

          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={experiencia}
              onValueChange={setExperiencia}
              style={styles.picker}
            >
              <Picker.Item
                label="Tempo de experiência"
                value=""
              />

              <Picker.Item
                label="Menos de 1 ano"
                value="Menos de 1 ano"
              />

              <Picker.Item
                label="1 a 3 anos"
                value="1 a 3 anos"
              />

              <Picker.Item
                label="3 a 5 anos"
                value="3 a 5 anos"
              />

              <Picker.Item
                label="5 a 10 anos"
                value="5 a 10 anos"
              />

              <Picker.Item
                label="Mais de 10 anos"
                value="Mais de 10 anos"
              />
            </Picker>
          </View>

          <Input
            placeholder="Fale sobre você e seus serviços"
            value={sobreMim}
            onChangeText={setSobreMim}
            multiline
          />

          <Button
            title="Salvar alterações"
            onPress={salvarPerfil}
          />

          <Button
            title="Voltar"
            onPress={() => goTo("homeProfissional")}
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

  container: {
    padding: 20,
    paddingBottom: 35,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: "#eee",
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0A2F73",
    marginBottom: 16,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#444",
    marginBottom: 6,
  },

  row: {
    flexDirection: "row",
    gap: 10,
  },

  dddContainer: {
    width: "25%",
  },

  phoneContainer: {
    flex: 1,
  },

  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    backgroundColor: "#fff",
    marginBottom: 12,
    overflow: "hidden",
  },

  picker: {
    height: 52,
    color: "#333",
  },
});