import React from "react";
import { View, StyleSheet, Text, Image } from "react-native";
import Button from "../components/Button";

import logo from "../../assets/logo.png";

export default function ChooseRegisterScreen({ goTo }) {
  return (
    <View style={styles.container}>
      <Image source={logo} style={styles.logo} />

      <Text style={styles.title}>Como você quer se cadastrar?</Text>

      <Text style={styles.subtitle}>
        Escolha uma opção para continuar no FazTudo.
      </Text>

      <View style={styles.card}>
        <Button
          title="Quero contratar um profissional"
          onPress={() => goTo("registerUser")}
          type="secondary"
        />

        <Button
          title="Quero oferecer meus serviços"
          onPress={() => goTo("registerAutonomo")}
          type="secondary"
        />

        <View style={styles.separator} />

        <Button
          title="Voltar ao LOGIN"
          onPress={() => goTo("login")}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    backgroundColor: "#fff",
  },

  logo: {
    width: 180,
    height: 180,
    resizeMode: "contain",
    alignSelf: "center",
    marginBottom: 10,
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
    marginBottom: 24,
  },

  card: {
    width: "100%",
  },

  separator: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 14,
  },
});