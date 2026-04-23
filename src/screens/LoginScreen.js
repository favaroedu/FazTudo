import React, { useState } from "react";
import { View, Image, Alert, StyleSheet, TouchableOpacity, Text } from "react-native";
import Input from "../components/Input";
import Button from "../components/Button";
import logo from "../../assets/logo.png";
import AsyncStorage from "@react-native-async-storage/async-storage";
import googleLogo from "../../assets/google.png";

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

  const handleGoogleLogin = () => {
    Alert.alert("Google Login", "Fluxo de login com Google ainda não implementado.");
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
      <TouchableOpacity
        onPress={() => goTo("forgotPassword")}
        style={styles.forgotPasswordContainer}
      >
        <Text style={styles.forgotPassword}>Esqueceu sua senha?</Text>
      </TouchableOpacity>



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

      {/* Linha divisória */}
      <View style={styles.dividerContainer}>
        <View style={styles.line} />
        <Text style={styles.dividerText}>ou</Text>
        <View style={styles.line} />
      </View>


      {/* Botão Google com logo */}
      <TouchableOpacity style={styles.googleButton} onPress={handleGoogleLogin}>
        <Image source={googleLogo} style={styles.googleLogo} />
        <Text style={styles.googleText}>Entrar com Google</Text>
      </TouchableOpacity>
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
  forgotPasswordContainer: {
    alignItems: "flex-end",
    marginBottom: 10,
  },
  forgotPassword: {
    color: "blue",
    fontSize: 14,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#aaa", // cor da linha cinza
  },
  dividerText: {
    marginHorizontal: 10,
    color: "#aaa",
    fontSize: 14,
  },


  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 25,   // deixa arredondado
    paddingVertical: 8,
    paddingHorizontal: 15,
    alignSelf: "center", // centraliza no layout
  },
  googleLogo: {
    width: 18,
    height: 18,
    marginRight: 8,
    resizeMode: "contain",
  },
  googleText: {
    fontSize: 14,
    color: "#000",
  },
});
