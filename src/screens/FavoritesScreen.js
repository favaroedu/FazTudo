import React from "react";

import {
  View,
  Text,
  StyleSheet,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import AppHeader from "../components/AppHeader";
import Button from "../components/Button";

export default function FavoritesScreen({ goTo }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <AppHeader
        title="Favoritos"
        subtitle="Profissionais salvos por você"
        showBack
        onBack={() => goTo("home")}
        backgroundColor="#0A2F73"
      />

      <View style={styles.container}>
        <View style={styles.emptyCard}>
          <Text style={styles.icon}>♡</Text>

          <Text style={styles.title}>
            Você ainda não possui favoritos
          </Text>

          <Text style={styles.subtitle}>
            Quando encontrar um profissional de confiança, salve aqui para acessar depois com facilidade.
          </Text>

          <Button
            title="Buscar profissionais"
            onPress={() => goTo("home")}
          />
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
    padding: 24,
  },

  emptyCard: {
    backgroundColor: "#fff7ed",
    borderRadius: 20,
    padding: 26,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ffe0b8",
  },

  icon: {
    fontSize: 52,
    color: "#ff9100ff",
    marginBottom: 12,
  },

  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "#0A2F73",
    textAlign: "center",
    marginBottom: 10,
  },

  subtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 22,
  },
});