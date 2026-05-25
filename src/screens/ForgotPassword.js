import React, { useState } from "react";

import {
  View,
  Text,
  Alert,
  StyleSheet,
  Image,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../services/firebaseConfig";

import Input from "../components/Input";
import Button from "../components/Button";
import AppHeader from "../components/AppHeader";

import logo from "../../assets/logo.png";

export default function ForgotPassword({ goTo }) {
  const [email, setEmail] = useState("");
  const [carregando, setCarregando] = useState(false);

  const handleResetPassword = async () => {
    const emailFormatado = email.trim().toLowerCase();

    if (!emailFormatado) {
      Alert.alert("Erro", "Digite seu email.");
      return;
    }

    try {
      setCarregando(true);

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
        mensagem = "Muitas tentativas. Tente novamente mais tarde.";
      }

      Alert.alert("Erro", mensagem);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <AppHeader
        title="Recuperar senha"
        subtitle="Redefina o acesso à sua conta"
        showBack
        onBack={() => goTo("login")}
        backgroundColor="#0A2F73"
      />

      <View style={styles.container}>
        <Image source={logo} style={styles.logo} />

        <Text style={styles.title}>
          Esqueceu sua senha?
        </Text>

        <Text style={styles.subtitle}>
          Digite o email cadastrado para receber as instruções de recuperação.
        </Text>

        <Input
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Button
          title={carregando ? "Enviando..." : "Enviar instruções"}
          onPress={handleResetPassword}
          disabled={carregando}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },

  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingBottom: 40,
    backgroundColor: "#fff",
  },

  logo: {
    width: 220,
    height: 220,
    resizeMode: "contain",
    alignSelf: "center",
    marginBottom: 14,
  },

  title: {
    fontSize: 26,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 10,
    color: "#0A2F73",
  },

  subtitle: {
    textAlign: "center",
    color: "#666",
    marginBottom: 26,
    fontSize: 14,
    lineHeight: 20,
  },
});