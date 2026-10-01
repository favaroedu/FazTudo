import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AppHeader from "../components/AppHeader";
import Button from "../components/Button";

// ==========================================
// WHATSAPP DO SUPORTE
// ==========================================
// Coloque o número com código do país.
// Exemplo: 5581999999999
const NUMERO_WHATSAPP_SUPORTE = "5581999999999";

export default function SuporteScreen({ goTo }) {
  const abrirWhatsApp = async () => {
    const mensagem = encodeURIComponent(
      "Olá! Preciso de ajuda com o aplicativo FazTudo."
    );

    const url = `https://wa.me/${NUMERO_WHATSAPP_SUPORTE}?text=${mensagem}`;

    try {
      await Linking.openURL(url);
    } catch (error) {
      Alert.alert(
        "Erro",
        "Não foi possível abrir o WhatsApp."
      );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <AppHeader
        title="Suporte"
        subtitle="Estamos aqui para ajudar"
        showBack
        onBack={() => goTo("homeProfissional")}
        backgroundColor="#0A2F73"
      />

      <View style={styles.container}>
        {/* ========================================== */}
        {/* ÍCONE */}
        {/* ========================================== */}

        <View style={styles.iconContainer}>
          <Text style={styles.icon}>🆘</Text>
        </View>

        {/* ========================================== */}
        {/* TÍTULO */}
        {/* ========================================== */}

        <Text style={styles.title}>
          Precisa de ajuda?
        </Text>

        <Text style={styles.description}>
          Entre em contato com nossa equipe pelo WhatsApp.
          Você pode tirar dúvidas, relatar problemas, enviar
          sugestões ou falar sobre qualquer situação relacionada
          ao FazTudo.
        </Text>

        {/* ========================================== */}
        {/* CARD */}
        {/* ========================================== */}

        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            💬 Atendimento pelo WhatsApp
          </Text>

          <Text style={styles.cardText}>
            Clique no botão abaixo para iniciar uma conversa
            com nossa equipe de suporte.
          </Text>

          <Button
            title="Falar com o suporte"
            onPress={abrirWhatsApp}
          />
        </View>

        {/* ========================================== */}
        {/* INFORMAÇÃO */}
        {/* ========================================== */}

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>
            Como podemos ajudar?
          </Text>

          <Text style={styles.infoText}>
            • Dúvidas sobre o aplicativo{"\n"}
            • Problemas ou erros{"\n"}
            • Sugestões de melhoria{"\n"}
            • Dificuldades com sua conta{"\n"}
            • Outras questões relacionadas ao FazTudo
          </Text>
        </View>

        {/* ========================================== */}
        {/* VOLTAR */}
        {/* ========================================== */}

        <View style={styles.bottomButton}>
          <Button
            title="Voltar"
            onPress={() => goTo("homeProfissional")}
            type="secondary"
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
    padding: 20,
  },

  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#fff7ed",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginTop: 20,
    marginBottom: 18,
  },

  icon: {
    fontSize: 38,
  },

  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#0A2F73",
    textAlign: "center",
    marginBottom: 10,
  },

  description: {
    fontSize: 14,
    color: "#666",
    lineHeight: 21,
    textAlign: "center",
    marginBottom: 25,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: "#eee",
    marginBottom: 18,
  },

  cardTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#0A2F73",
    marginBottom: 8,
  },

  cardText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    marginBottom: 16,
  },

  infoCard: {
    backgroundColor: "#fff7ed",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#ffe0b8",
  },

  infoTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0A2F73",
    marginBottom: 8,
  },

  infoText: {
    fontSize: 13,
    color: "#555",
    lineHeight: 22,
  },

  bottomButton: {
    marginTop: "auto",
    paddingTop: 25,
  },
});