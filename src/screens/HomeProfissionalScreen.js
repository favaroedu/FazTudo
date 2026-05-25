import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
  ScrollView,
  Alert,
} from "react-native";

import Button from "../components/Button";
import AppHeader from "../components/AppHeader";
import { SafeAreaView } from "react-native-safe-area-context";

const screenWidth = Dimensions.get("window").width;

export default function HomeProfissionalScreen({ goTo }) {
  const [menuAberto, setMenuAberto] = useState(false);
  const menuAnim = useRef(new Animated.Value(screenWidth)).current;

  const confirmarVoltar = () => {
    Alert.alert(
      "Voltar para o login?",
      "Você deseja sair da página inicial?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Sim, sair", onPress: () => goTo("login") },
      ]
    );
  };

  const abrirMenu = () => {
    setMenuAberto(true);

    Animated.timing(menuAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const fecharMenu = () => {
    Animated.timing(menuAnim, {
      toValue: screenWidth,
      duration: 300,
      useNativeDriver: false,
    }).start(() => setMenuAberto(false));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <AppHeader
        title="Painel Profissional"
        subtitle="Gerencie seus serviços"
        showBack
        showMenu
        backgroundColor="#0A2F73"
        onBack={confirmarVoltar}
        onMenu={abrirMenu}
      />

      {menuAberto && (
        <TouchableWithoutFeedback onPress={fecharMenu}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>
      )}

      <Animated.View style={[styles.menuContainer, { right: menuAnim }]}>
        <View style={styles.menuContent}>
          <View style={styles.userInfo}>
            <View style={styles.avatar} />
            <Text style={styles.userName}>Olá, Profissional!</Text>
            <Text style={styles.userEmail}>profissional@email.com</Text>
          </View>

          <Button
            title="Meu Perfil Profissional"
            onPress={() => goTo("profile")}
          />

          <Button
            title="Solicitações Recebidas"
            onPress={() => goTo("solicitacoes")}
          />

          <Button
            title="Minha Agenda"
            onPress={() => goTo("agenda")}
          />

          <Button
            title="Meus Serviços"
            onPress={() => goTo("meusServicos")}
          />

          <Button
            title="Avaliações"
            onPress={() => goTo("avaliacoes")}
          />

          <Button
            title="Mensagens"
            onPress={() => goTo("mensagens")}
          />

          <Button
            title="Configurações"
            onPress={() => goTo("configuracoes")}
          />

          <Button
            title="Suporte"
            onPress={() => goTo("suporte")}
          />

          <Button
            title="Sair do aplicativo"
            onPress={() => goTo("login")}
            type="secondary"
          />

          <Button
            title="Fechar menu"
            onPress={fecharMenu}
            type="secondary"
          />
        </View>
      </Animated.View>

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroCard}>
          <Text style={styles.heroTitle}>Bem-vindo ao seu painel</Text>

          <Text style={styles.heroSubtitle}>
            Acompanhe solicitações, gerencie sua agenda e organize seus serviços.
          </Text>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Solicitações</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Agendamentos</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ações rápidas</Text>

          <Button
            title="Ver solicitações recebidas"
            onPress={() => goTo("solicitacoes")}
          />

          <Button
            title="Abrir minha agenda"
            onPress={() => goTo("agenda")}
            type="secondary"
          />

          <Button
            title="Editar meus serviços"
            onPress={() => goTo("meusServicos")}
            type="secondary"
          />
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Dica para profissionais</Text>

          <Text style={styles.infoText}>
            Mantenha seus dados atualizados para aumentar suas chances de ser
            encontrado por clientes.
          </Text>
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

  heroCard: {
    backgroundColor: "#ff9100ff",
    borderRadius: 18,
    padding: 20,
    marginBottom: 18,
  },

  heroTitle: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 8,
  },

  heroSubtitle: {
    color: "#fff",
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.95,
  },

  statsGrid: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 22,
  },

  statCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: "#eee",
    alignItems: "center",
  },

  statNumber: {
    fontSize: 28,
    fontWeight: "900",
    color: "#0A2F73",
  },

  statLabel: {
    fontSize: 13,
    color: "#666",
    marginTop: 4,
    textAlign: "center",
  },

  section: {
    marginBottom: 22,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#0A2F73",
    marginBottom: 10,
  },

  infoCard: {
    backgroundColor: "#fff7ed",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#ffe0b8",
  },

  infoTitle: {
    color: "#0A2F73",
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 6,
  },

  infoText: {
    color: "#555",
    fontSize: 13,
    lineHeight: 19,
  },

  menuContainer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: Dimensions.get("window").width * 0.75,
    backgroundColor: "#f5f5f5",
    zIndex: 20,
    paddingTop: 60,
    shadowColor: "#000",
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },

  menuContent: {
    paddingHorizontal: 20,
  },

  overlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: Dimensions.get("window").width * 0.75,
    backgroundColor: "rgba(0,0,0,0.3)",
    zIndex: 15,
  },

  userInfo: {
    alignItems: "center",
    marginBottom: 20,
  },

  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#ccc",
    marginBottom: 10,
  },

  userName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111",
  },

  userEmail: {
    fontSize: 14,
    color: "#666",
  },
});