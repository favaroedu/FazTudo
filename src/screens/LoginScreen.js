import React, { useState } from "react";
import { View, Image, Alert, StyleSheet } from "react-native";
import Input from "../components/Input";
import Button from "../components/Button";
import logo from "../../assets/logo.png";
import { getCredentials } from "../services/storage";

export default function LoginScreen({ goTo }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const handleLogin = async () => {
    const { email: savedEmail, senha: savedSenha } = await getCredentials();
    if (email === savedEmail && senha === savedSenha) {
      Alert.alert("Login realizado!");
      goTo("home");
    } else {
      Alert.alert("Email ou senha incorretos");
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
