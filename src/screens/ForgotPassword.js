import React, { useState } from "react";
import {
  View,
  Text,
  Alert,
  StyleSheet,
  Image,
} from "react-native";

import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../services/firebaseConfig";

import Input from "../components/Input";
import Button from "../components/Button";

import logo from "../../assets/logo.png";

export default function ForgotPassword({ goTo }) {
  const [email, setEmail] = useState("");

  const handleResetPassword = async () => {
    const emailFormatado = email.trim().toLowerCase();

    if (!emailFormatado) {
      Alert.alert("Erro", "Digite seu email.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, emailFormatado);

      Alert.alert(
        "Email enviado",
        `As instruções de recuperação foram enviadas para ${emailFormatado}.`
      );

      goTo("login");
    } catch (error) {
      console.log("Erro Firebase:", error);

      let mensagem = "Não foi possível enviar o email.";

      if (error.code === "auth/user-not-found") {
        mensagem = "Nenhuma conta encontrada com esse email.";
      }

      if (error.code === "auth/invalid-email") {
        mensagem = "Email inválido.";
      }

      if (error.code === "auth/too-many-requests") {
        mensagem =
          "Muitas tentativas. Tente novamente mais tarde.";
      }

      Alert.alert("Erro", mensagem);
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