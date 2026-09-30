import React, { useState, useRef, useEffect } from "react";

import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
  ScrollView,
  Alert,
  Image,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { doc, getDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { auth, db } from "../services/firebaseConfig";

import Button from "../components/Button";
import AppHeader from "../components/AppHeader";
import seloPremium from "../../assets/selopremium.png";

const screenWidth = Dimensions.get("window").width;

export default function HomeProfissionalScreen({ goTo }) {
  const [menuAberto, setMenuAberto] = useState(false);
  const [profissional, setProfissional] = useState(null);

  const menuAnim = useRef(new Animated.Value(screenWidth)).current;

  // ==========================================
  // CARREGAR DADOS DO PROFISSIONAL
  // ==========================================

  const carregarProfissional = async () => {
    try {
      const user = auth.currentUser;

      if (!user) return;

      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        setProfissional(userSnap.data());
      }
    } catch (error) {
      console.log("Erro ao carregar profissional:", error);
    }
  };

  useEffect(() => {
    carregarProfissional();
  }, []);

  // ==========================================
  // SAIR DO APLICATIVO
  // ==========================================

  const sairDoApp = async () => {
    try {
      await signOut(auth);
      goTo("login");
    } catch (error) {
      console.log("Erro ao sair:", error);

      Alert.alert(
        "Erro",
        "Não foi possível sair da conta."
      );
    }
  };

  // ==========================================
  // CONFIRMAR VOLTA
  // ==========================================

  const confirmarVoltar = () => {
    Alert.alert(
      "Voltar para o login?",
      "Você deseja sair da página inicial?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Sim, sair",
          onPress: sairDoApp,
        },
      ]
    );
  };

  // ==========================================
  // MENU LATERAL
  // ==========================================

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
    }).start(() => {
      setMenuAberto(false);
    });
  };

  const navegarMenu = (tela) => {
    fecharMenu();
    goTo(tela);
  };

  // ==========================================
  // PERFIL PÚBLICO
  // ==========================================

  const abrirPerfilPublico = () => {
    fecharMenu();

    goTo("professionalProfile", {
      profissionalId: auth.currentUser?.uid,
      origem: "homeProfissional",
    });
  };

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <SafeAreaView style={styles.safeArea}>
      <AppHeader
        title="Painel Profissional"
        subtitle="Gerencie sua presença no FazTudo"
        showBack
        showMenu
        backgroundColor="#0A2F73"
        onBack={confirmarVoltar}
        onMenu={abrirMenu}
      />

      {/* ========================================== */}
      {/* OVERLAY */}
      {/* ========================================== */}

      {menuAberto && (
        <TouchableWithoutFeedback onPress={fecharMenu}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>
      )}

      {/* ========================================== */}
      {/* MENU LATERAL */}
      {/* ========================================== */}

      <Animated.View
        style={[
          styles.menuContainer,
          {
            right: menuAnim,
          },
        ]}
      >
        <ScrollView
          contentContainerStyle={styles.menuScrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.menuContent}>
            {/* ========================================== */}
            {/* INFORMAÇÕES DO PROFISSIONAL */}
            {/* ========================================== */}

            <View style={styles.userInfo}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {profissional?.nome
                    ? profissional.nome.charAt(0).toUpperCase()
                    : "P"}
                </Text>
              </View>

              <Text style={styles.userName}>
                Olá,{" "}
                {profissional?.nome
                  ? profissional.nome.split(" ")[0]
                  : "Profissional"}
                !
              </Text>

              <Text style={styles.userEmail}>
                {profissional?.email || "email não informado"}
              </Text>
            </View>

            {/* ========================================== */}
            {/* 👤 MINHA CONTA */}
            {/* ========================================== */}

            <Text style={styles.menuSectionTitle}>
              👤 Minha conta
            </Text>

            <Button
              title="Ver meu perfil público"
              onPress={abrirPerfilPublico}
            />

            <Button
              title="Editar Perfil"
              onPress={() =>
                navegarMenu("editProfessionalProfile")
              }
            />

            {/* ========================================== */}
            {/* 💼 TRABALHO */}
            {/* ========================================== */}

            <Text style={styles.menuSectionTitle}>
              💼 Trabalho
            </Text>

            <Button
              title="Minha Agenda"
              onPress={() => navegarMenu("agenda")}
            />

            <Button
              title="Meus Serviços"
              onPress={() => navegarMenu("meusServicos")}
            />

            {/* ========================================== */}
            {/* ⭐ REPUTAÇÃO */}
            {/* ========================================== */}

            <Text style={styles.menuSectionTitle}>
              ⭐ Reputação
            </Text>

            <Button
              title="Minhas Avaliações"
              onPress={() =>
                navegarMenu("professionalReviews")
              }
            />

            {/*
              QR Code de Avaliação será adicionado
              posteriormente.
            */}

            {/* ========================================== */}
            {/* ⚙️ OUTROS */}
            {/* ========================================== */}

            <Text style={styles.menuSectionTitle}>
              ⚙️ Outros
            </Text>

            <Button
              title="Configurações"
              onPress={() => navegarMenu("configuracoes")}
            />

            <Button
              title="Suporte"
              onPress={() => navegarMenu("suporte")}
            />

            {/* ========================================== */}
            {/* 🚪 SAIR */}
            {/* ========================================== */}

            <Text style={styles.menuSectionTitle}>
              🚪 Sair
            </Text>

            <Button
              title="Sair"
              onPress={sairDoApp}
              type="secondary"
            />

            <Button
              title="Fechar menu"
              onPress={fecharMenu}
              type="secondary"
            />
          </View>
        </ScrollView>
      </Animated.View>

      {/* ========================================== */}
      {/* CONTEÚDO PRINCIPAL */}
      {/* ========================================== */}

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* ========================================== */}
        {/* HERO */}
        {/* ========================================== */}

        <View style={styles.heroCard}>
          <Text style={styles.heroTitle}>
            Bem-vindo ao seu painel
          </Text>

          <Text style={styles.heroSubtitle}>
            Mantenha seu perfil atualizado para ser encontrado
            por mais clientes.
          </Text>
        </View>

        {/* ========================================== */}
        {/* RESUMO DO PERFIL */}
        {/* ========================================== */}

        <View style={styles.profileSummaryCard}>
          <Text style={styles.sectionTitle}>
            Resumo do perfil
          </Text>

          <View style={styles.summaryNameRow}>
            <Text style={styles.summaryName}>
              {profissional?.nome || "Nome não informado"}
            </Text>

            {profissional?.plano === "profissional" && (
              <Image
                source={seloPremium}
                style={styles.premiumBadge}
              />
            )}
          </View>

          <Text style={styles.summaryService}>
            {profissional?.servico ||
              "Área de atuação não informada"}
          </Text>

          <Text style={styles.summaryLocation}>
            {profissional?.cidade || "Cidade"} -{" "}
            {profissional?.uf || "UF"}
          </Text>

          <Text style={styles.summaryRating}>
            ⭐{" "}
            {profissional?.totalAvaliacoes > 0
              ? `${Number(
                  profissional?.mediaAvaliacoes || 0
                ).toFixed(1)} (${profissional.totalAvaliacoes} avaliação${
                  profissional.totalAvaliacoes > 1
                    ? "ões"
                    : ""
                })`
              : "Ainda sem avaliações"}
          </Text>
        </View>

        {/* ========================================== */}
        {/* ESTATÍSTICAS */}
        {/* ========================================== */}

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {profissional?.totalAvaliacoes || 0}
            </Text>

            <Text style={styles.statLabel}>
              Avaliações
            </Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {profissional?.mediaAvaliacoes
                ? Number(
                    profissional.mediaAvaliacoes
                  ).toFixed(1)
                : "0.0"}
            </Text>

            <Text style={styles.statLabel}>
              Nota média
            </Text>
          </View>
        </View>

        {/* ========================================== */}
        {/* AÇÕES RÁPIDAS */}
        {/* ========================================== */}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Ações rápidas
          </Text>

          <Button
            title="Ver meu perfil público"
            onPress={abrirPerfilPublico}
          />

          <Button
            title="Editar meu perfil"
            onPress={() =>
              goTo("editProfessionalProfile")
            }
            type="secondary"
          />

          <Button
            title="Ver minhas avaliações"
            onPress={() =>
              goTo("professionalReviews")
            }
            type="secondary"
          />
        </View>

        {/* ========================================== */}
        {/* DICA */}
        {/* ========================================== */}

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>
            Dica para profissionais
          </Text>

          <Text style={styles.infoText}>
            Um perfil completo, com descrição clara, contato
            atualizado e boas avaliações, aumenta suas chances
            de ser escolhido pelos clientes.
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

  /* ========================================== */
  /* HERO */
  /* ========================================== */

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

  /* ========================================== */
  /* RESUMO DO PERFIL */
  /* ========================================== */

  profileSummaryCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "#eee",
  },

  summaryNameRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },

  summaryName: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0A2F73",
  },

  premiumBadge: {
    width: 22,
    height: 22,
    marginLeft: 6,
    resizeMode: "contain",
  },

  summaryService: {
    fontSize: 14,
    fontWeight: "700",
    color: "#ff9100ff",
    marginBottom: 4,
  },

  summaryLocation: {
    fontSize: 13,
    color: "#666",
    marginBottom: 6,
  },

  summaryRating: {
    fontSize: 13,
    color: "#555",
  },

  /* ========================================== */
  /* ESTATÍSTICAS */
  /* ========================================== */

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

  /* ========================================== */
  /* SEÇÕES */
  /* ========================================== */

  section: {
    marginBottom: 22,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#0A2F73",
    marginBottom: 10,
  },

  /* ========================================== */
  /* DICA */
  /* ========================================== */

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

  /* ========================================== */
  /* MENU LATERAL */
  /* ========================================== */

  menuContainer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: Dimensions.get("window").width * 0.75,
    backgroundColor: "#f5f5f5",
    zIndex: 20,

    shadowColor: "#000",
    shadowOffset: {
      width: -2,
      height: 0,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,

    elevation: 5,
  },

  menuScrollContent: {
    paddingTop: 60,
    paddingBottom: 30,
  },

  menuContent: {
    paddingHorizontal: 20,
  },

  /* ========================================== */
  /* INFORMAÇÕES DO USUÁRIO */
  /* ========================================== */

  userInfo: {
    alignItems: "center",
    marginBottom: 20,
  },

  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#0A2F73",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },

  avatarText: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "900",
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

  /* ========================================== */
  /* TÍTULOS DO MENU */
  /* ========================================== */

  menuSectionTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#0A2F73",
    marginTop: 16,
    marginBottom: 8,
    paddingBottom: 7,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },

  /* ========================================== */
  /* OVERLAY */
  /* ========================================== */

  overlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: Dimensions.get("window").width * 0.75,
    backgroundColor: "rgba(0,0,0,0.3)",
    zIndex: 15,
  },
});