import React, { useState } from "react";
import { View, Image, Alert, StyleSheet } from "react-native";
import Input from "../components/Input";
import Button from "../components/Button";
import logo from "../../assets/logo.png";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LoginScreen({ goTo }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const handleLogin = async () => {
    try {
      const usuarios = JSON.parse(await AsyncStorage.getItem("usuarios")) || [];
      const profissionais = JSON.parse(await AsyncStorage.getItem("profissionais")) || [];
      const todos = [...usuarios, ...profissionais];

      const encontrado = todos.find(
        u => u.email === email.toLowerCase() && u.senha === senha
      );

      if (encontrado) {
        Alert.alert("Sucesso", "Login realizado com sucesso!");
        goTo("home");
      } else {
        Alert.alert("Erro", "Email ou senha incorretos.");
      }
    } catch (error) {
      console.error("Erro ao tentar login:", error);
      Alert.alert("Erro", "Não foi possível realizar o login.");
    }
  };

  return (
    <View style={styles.container}>
      <Image source={logo} style={styles.logo} />
      <Input
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Input
        placeholder="Senha"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
      />
      <Button title="Entrar" onPress={handleLogin} />
      <Button
        title="Cadastrar"
        onPress={() => goTo("chooseRegister")}
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
    width: 350,
    height: 350,
    resizeMode: "contain",
    alignSelf: "center",
    marginBottom: 30,
  },
});
