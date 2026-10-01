import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  Alert,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AppHeader from "../components/AppHeader";
import Button from "../components/Button";

export default function ConfiguracoesScreen({ goTo }) {
  const [notificacoesAtivas, setNotificacoesAtivas] = useState(true);

  const alterarSenha = () => {
    Alert.alert(
      "Alterar senha",
      "A recuperação da senha será feita através do seu e-mail cadastrado.",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Continuar",
          onPress: () => goTo("forgotPassword"),
        },
      ]
    );
  };

  const abrirPrivacidade = () => {
    Alert.alert(
      "Política de Privacidade",
      "A Política de Privacidade do FazTudo estará disponível nesta seção."
    );
  };

  const abrirTermos = () => {
    Alert.alert(
      "Termos de Uso",
      "Os Termos de Uso do FazTudo estarão disponíveis nesta seção."
    );
  };

  const abrirSobre = () => {
    Alert.alert(
      "Sobre o FazTudo",
      "FazTudo\n\nPlataforma para conectar clientes e profissionais de serviços.\n\nVersão 1.0.0"
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <AppHeader
        title="Configurações"
        subtitle="Preferências do aplicativo"
        showBack
        onBack={() => goTo("homeProfissional")}
        backgroundColor="#0A2F73"
      />

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* ========================================== */}
        {/* 🔔 NOTIFICAÇÕES */}
        {/* ========================================== */}

        <Text style={styles.sectionTitle}>🔔 Notificações</Text>

        <View style={styles.optionCard}>
          <View style={styles.optionTextContainer}>
            <Text style={styles.optionTitle}>
              Receber notificações
            </Text>

            <Text style={styles.optionDescription}>
              Permitir que o FazTudo envie notificações sobre sua conta e
              atividades importantes.
            </Text>
          </View>

          <Switch
            value={notificacoesAtivas}
            onValueChange={setNotificacoesAtivas}
          />
        </View>

        {/* ========================================== */}
        {/* 🔒 PRIVACIDADE E SEGURANÇA */}
        {/* ========================================== */}

        <Text style={styles.sectionTitle}>
          🔒 Privacidade e segurança
        </Text>

        <Button
          title="Alterar senha"
          onPress={alterarSenha}
        />

        <Button
          title="Política de Privacidade"
          onPress={abrirPrivacidade}
          type="secondary"
        />

        <Button
          title="Termos de Uso"
          onPress={abrirTermos}
          type="secondary"
        />

        {/* ========================================== */}
        {/* 📱 APLICATIVO */}
        {/* ========================================== */}

        <Text style={styles.sectionTitle}>📱 Aplicativo</Text>

        <TouchableOpacity
          style={styles.aboutCard}
          onPress={abrirSobre}
          activeOpacity={0.8}
        >
          <View>
            <Text style={styles.optionTitle}>
              Sobre o FazTudo
            </Text>

            <Text style={styles.optionDescription}>
              Saiba mais sobre o aplicativo.
            </Text>
          </View>

          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>

        <View style={styles.versionCard}>
          <Text style={styles.versionLabel}>
            Versão do aplicativo
          </Text>

          <Text style={styles.versionValue}>
            1.0.0
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
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },

  container: {
    padding: 20,
    paddingBottom: 35,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#0A2F73",
    marginTop: 18,
    marginBottom: 10,
  },

  optionCard: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  optionTextContainer: {
    flex: 1,
    paddingRight: 12,
  },

  optionTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#222",
    marginBottom: 5,
  },

  optionDescription: {
    fontSize: 13,
    lineHeight: 18,
    color: "#666",
  },

  aboutCard: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  arrow: {
    fontSize: 30,
    color: "#0A2F73",
    fontWeight: "300",
  },

  versionCard: {
    backgroundColor: "#f7f7f7",
    borderRadius: 14,
    padding: 16,
    marginTop: 2,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  versionLabel: {
    fontSize: 14,
    color: "#666",
  },

  versionValue: {
    fontSize: 14,
    fontWeight: "800",
    color: "#0A2F73",
  },

  bottomButton: {
    marginTop: 25,
  },
});