import React, { useState } from "react";
import {
  View,
  Text,
  Alert,
  StyleSheet,
  Image,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

import Input from "../components/Input";
import Button from "../components/Button";

import logo from "../../assets/logo.png";

export default function ForgotPassword({ goTo }) {
  const [email, setEmail] = useState("");

  const handleResetPassword = async () => {
    if (!email.trim()) {
      Alert.alert("Erro", "Digite seu email.");
      return;
    }

    try {
      const usuarios =
        JSON.parse(await AsyncStorage.getItem("usuarios")) || [];

      const profissionais =
        JSON.parse(await AsyncStorage.getItem("profissionais")) || [];

      const todos = [...usuarios, ...profissionais];

      const encontrado = todos.find(
        (u) => u.email === email.trim().toLowerCase()
      );

      if (encontrado) {
        Alert.alert(
          "Recuperação de senha",
          `Instruções de recuperação enviadas para ${email.trim()}.`
        );

        goTo("login");
      } else {
        Alert.alert(
          "Erro",
          "Não encontramos nenhuma conta com esse email."
        );
      }
    } catch (error) {
      console.error("Erro ao recuperar senha:", error);

      Alert.alert(
        "Erro",
        "Não foi possível processar a recuperação."
      );
    }
  };

  return (
    <View style={styles.container}>
      <Image source={logo} style={styles.logo} />

      <Text style={styles.title}>
        Recuperar senha
      </Text>

      <Text style={styles.subtitle}>
        Digite o email da sua conta para continuar.
      </Text>

      <Input
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Button
        title="Enviar instruções"
        onPress={handleResetPassword}
      />

      <Button
        title="Voltar para login"
        onPress={() => goTo("login")}
        type="secondary"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
  },

  logo: {
    width: 250,
    height: 250,
    resizeMode: "contain",
    alignSelf: "center",
    marginBottom: 20,
  },

  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: "#000",
  },

  subtitle: {
    textAlign: "center",
    color: "#666",
    marginBottom: 25,
    fontSize: 14,
  },
});