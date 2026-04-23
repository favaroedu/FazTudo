import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ForgotPassword({ goTo }) {
  const [email, setEmail] = useState("");

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert("Erro", "Por favor, insira seu email.");
      return;
    }

    try {
      // Recupera usuários e profissionais do AsyncStorage
      const usuarios = JSON.parse(await AsyncStorage.getItem("usuarios")) || [];
      const profissionais = JSON.parse(await AsyncStorage.getItem("profissionais")) || [];
      const todos = [...usuarios, ...profissionais];

      // Verifica se o email existe
      const encontrado = todos.find(u => u.email === email.toLowerCase());

      if (encontrado) {
        Alert.alert(
          "Recuperação de senha",
          `Enviamos instruções para redefinir a senha do email ${email}.`
        );
        goTo("login"); // volta para tela de login
      } else {
        Alert.alert("Erro", "Não encontramos nenhuma conta com esse email.");
      }
    } catch (error) {
      console.error("Erro ao tentar recuperar senha:", error);
      Alert.alert("Erro", "Não foi possível processar a recuperação de senha.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recuperar senha</Text>
      <TextInput
        placeholder="Digite seu email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
      />
      <Button title="Enviar instruções" onPress={handleResetPassword} />
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
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
});
