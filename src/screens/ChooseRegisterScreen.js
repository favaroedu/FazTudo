import React from "react";

import {
  View,
  StyleSheet,
  Text,
  Image,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import Button from "../components/Button";
import AppHeader from "../components/AppHeader";

import logo from "../../assets/logo.png";

export default function ChooseRegisterScreen({ goTo }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <AppHeader
        title="Criar conta"
        subtitle="Escolha como deseja utilizar o app"
        showBack
        onBack={() => goTo("login")}
        backgroundColor="#0A2F73"
      />

      <View style={styles.container}>
        <Image source={logo} style={styles.logo} />

        <Text style={styles.title}>
          Como você quer se cadastrar?
        </Text>

        <Text style={styles.subtitle}>
          Escolha uma opção para continuar no FazTudo.
        </Text>

        <View style={styles.card}>
          <View style={styles.optionCard}>
            <Text style={styles.optionTitle}>
              Quero contratar um profissional
            </Text>

            <Text style={styles.optionDescription}>
              Busque profissionais para serviços residenciais e acompanhe seus agendamentos.
            </Text>

            <Button
              title="Cadastrar como usuário"
              onPress={() => goTo("registerUser")}
              type="secondary"
            />
          </View>

          <View style={styles.optionCard}>
            <Text style={styles.optionTitle}>
              Quero oferecer meus serviços
            </Text>

            <Text style={styles.optionDescription}>
              Divulgue seus serviços e receba solicitações de clientes.
            </Text>

            <Button
              title="Cadastrar como profissional"
              onPress={() => goTo("registerAutonomo")}
              type="secondary"
            />
          </View>
        </View>
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
    paddingBottom: 24,
    backgroundColor: "#fff",
  },

  logo: {
    width: 160,
    height: 160,
    resizeMode: "contain",
    alignSelf: "center",
    marginBottom: 8,
  },

  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#0A2F73",
    textAlign: "center",
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 28,
    lineHeight: 20,
  },

  card: {
    width: "100%",
  },

  optionCard: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
  },

  optionTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#0A2F73",
    marginBottom: 8,
  },

  optionDescription: {
    fontSize: 13,
    color: "#666",
    lineHeight: 19,
    marginBottom: 14,
  },
});