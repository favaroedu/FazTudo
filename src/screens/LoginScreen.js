import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";

import React, { useState, useEffect } from "react";

import {
  View,
  Image,
  Alert,
  StyleSheet,
  TouchableOpacity,
  Text,
  ScrollView,
} from "react-native";

import {
  GoogleAuthProvider,
  signInWithCredential,
  signInWithEmailAndPassword,
} from "firebase/auth";

import { doc, getDoc } from "firebase/firestore";

import Input from "../components/Input";
import Button from "../components/Button";

import logo from "../../assets/logo.png";
import googleLogo from "../../assets/google.png";

import { auth, db } from "../services/firebaseConfig";

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen({ goTo }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [carregando, setCarregando] = useState(false);

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId:
      "1013595704590-hhvgtbd9upjm4ce5kddju76eo8nck4d4.apps.googleusercontent.com",
    webClientId:
      "1013595704590-bnpd9sjgpmbg7idrmocugi165gq9q6io.apps.googleusercontent.com",
  });

  const redirecionarPorTipo = async (user) => {
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      Alert.alert(
        "Cadastro incompleto",
        "Escolha o tipo de conta para finalizar seu cadastro."
      );

      goTo("chooseRegister");
      return;
    }

    const dados = userSnap.data();

    if (dados.tipo === "usuario") {
      goTo("home");
      return;
    }

    if (dados.tipo === "profissional") {
      goTo("homeProfissional");
      return;
    }

    Alert.alert("Erro", "Tipo de conta não identificado.");
  };

  useEffect(() => {
    const loginGoogle = async () => {
      if (response?.type !== "success") return;

      const { authentication } = response;
      if (!authentication) return;

      try {
        setCarregando(true);

        const credential = GoogleAuthProvider.credential(
          authentication.idToken,
          authentication.accessToken
        );

        const userCredential = await signInWithCredential(auth, credential);

        await redirecionarPorTipo(userCredential.user);
      } catch (error) {
        console.error("Erro Google Login:", error);
        Alert.alert("Erro", "Não foi possível entrar com Google.");
      } finally {
        setCarregando(false);
      }
    };

    loginGoogle();
  }, [response]);

  const handleLogin = async () => {
    const emailFormatado = email.trim().toLowerCase();

    if (!emailFormatado || !senha.trim()) {
      Alert.alert("Erro", "Preencha email e senha.");
      return;
    }

    try {
      setCarregando(true);

      const userCredential = await signInWithEmailAndPassword(
        auth,
        emailFormatado,
        senha
      );

      await redirecionarPorTipo(userCredential.user);
    } catch (error) {
      console.error("Erro ao tentar login:", error);

      let mensagem = "Não foi possível realizar o login.";

      if (
        error.code === "auth/invalid-credential" ||
        error.code === "auth/wrong-password" ||
        error.code === "auth/user-not-found"
      ) {
        mensagem = "Email ou senha incorretos.";
      }

      if (error.code === "auth/invalid-email") {
        mensagem = "Email inválido.";
      }

      Alert.alert("Erro", mensagem);
    } finally {
      setCarregando(false);
    }
  };

  const handleGoogleLogin = () => {
    promptAsync();
  };

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContainer}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.container}>
        <Image source={logo} style={styles.logo} />

        <Text style={styles.title}>Bem-vindo ao FazTudo</Text>

        <Text style={styles.subtitle}>
          Encontre profissionais de confiança perto de você.
        </Text>

        <View style={styles.card}>
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

          <TouchableOpacity
            onPress={() => goTo("forgotPassword")}
            style={styles.forgotPasswordContainer}
          >
            <Text style={styles.forgotPassword}>Esqueceu sua senha?</Text>
          </TouchableOpacity>

          <Button
            title={carregando ? "Entrando..." : "Entrar"}
            onPress={handleLogin}
            disabled={carregando}
          />

          <Button
            title="Cadastrar"
            onPress={() => goTo("chooseRegister")}
            type="secondary"
          />

          <View style={styles.dividerContainer}>
            <View style={styles.line} />
            <Text style={styles.dividerText}>ou</Text>
            <View style={styles.line} />
          </View>

          <TouchableOpacity
            style={[
              styles.googleButton,
              (!request || carregando) && styles.googleButtonDisabled,
            ]}
            onPress={handleGoogleLogin}
            disabled={!request || carregando}
          >
            <Image source={googleLogo} style={styles.googleLogo} />

            <Text style={styles.googleText}>Entrar com Google</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: "#fff",
  },

  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 30,
    backgroundColor: "#fff",
  },

  logo: {
    width: 230,
    height: 230,
    resizeMode: "contain",
    alignSelf: "center",
    marginBottom: 10,
  },

  title: {
    fontSize: 24,
    fontWeight: "800",
    textAlign: "center",
    color: "#0A2F73",
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 14,
    textAlign: "center",
    color: "#666",
    marginBottom: 22,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 4,
  },

  forgotPasswordContainer: {
    alignItems: "flex-end",
    marginTop: -4,
    marginBottom: 12,
  },

  forgotPassword: {
    color: "#0A2F73",
    fontSize: 13,
    fontWeight: "600",
  },

  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 18,
  },

  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#ddd",
  },

  dividerText: {
    marginHorizontal: 12,
    color: "#999",
    fontSize: 13,
  },

  googleButton: {
    height: 48,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },

  googleButtonDisabled: {
    opacity: 0.6,
  },

  googleLogo: {
    width: 20,
    height: 20,
    marginRight: 10,
    resizeMode: "contain",
  },

  googleText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
});