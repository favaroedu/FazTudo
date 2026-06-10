import React, { useEffect, useState } from "react";

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../services/firebaseConfig";

import AppHeader from "../components/AppHeader";
import Button from "../components/Button";

export default function ProfessionalPlanScreen({ goTo }) {
  const [plano, setPlano] = useState("gratuito");
  const [statusPlano, setStatusPlano] = useState("ativo");

  const carregarPlano = async () => {
    try {
      const user = auth.currentUser;

      if (!user) return;

      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const dados = userSnap.data();

        setPlano(dados.plano || "gratuito");
        setStatusPlano(dados.statusPlano || "ativo");
      }
    } catch (error) {
      console.log("Erro ao carregar plano:", error);
    }
  };

  useEffect(() => {
    carregarPlano();
  }, []);

  const simularUpgrade = async () => {
    try {
      const user = auth.currentUser;

      if (!user) {
        Alert.alert("Erro", "Usuário não autenticado.");
        return;
      }

      await updateDoc(doc(db, "users", user.uid), {
        plano: "profissional",
        statusPlano: "ativo",
      });

      setPlano("profissional");
      setStatusPlano("ativo");

      Alert.alert(
        "Plano atualizado",
        "Simulação realizada com sucesso. Pagamento real será implementado futuramente."
      );
    } catch (error) {
      console.log("Erro ao atualizar plano:", error);
      Alert.alert("Erro", "Não foi possível atualizar o plano.");
    }
  };

  const planoProfissionalAtivo = plano === "profissional";

  return (
    <SafeAreaView style={styles.safeArea}>
      <AppHeader
        title="Meu Plano"
        subtitle="Gerencie sua assinatura"
        showBack
        onBack={() => goTo("homeProfissional")}
        backgroundColor="#0A2F73"
      />

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.currentPlanCard}>
          <Text style={styles.cardLabel}>Plano atual</Text>

          <Text style={styles.currentPlanTitle}>
            {planoProfissionalAtivo ? "Profissional" : "Gratuito"}
          </Text>

          <Text style={styles.statusText}>
            Status: {statusPlano === "ativo" ? "Ativo" : "Inativo"}
          </Text>
        </View>

        <View style={styles.planCard}>
          <Text style={styles.planTitle}>Plano Gratuito</Text>
          <Text style={styles.planPrice}>R$ 0,00</Text>

          <Text style={styles.benefit}>✓ Perfil público</Text>
          <Text style={styles.benefit}>✓ Aparecer nas buscas</Text>
          <Text style={styles.benefit}>✓ Receber avaliações</Text>

          <Text style={styles.limitation}>✗ Sem destaque nos resultados</Text>
          <Text style={styles.limitation}>✗ Sem selo profissional</Text>
        </View>

        <View style={styles.planCardFeatured}>
          <Text style={styles.planTitleFeatured}>Plano Profissional</Text>
          <Text style={styles.planPriceFeatured}>R$ 4,99/mês</Text>

          <Text style={styles.benefitFeatured}>✓ Perfil destacado</Text>
          <Text style={styles.benefitFeatured}>✓ Selo profissional</Text>
          <Text style={styles.benefitFeatured}>✓ Prioridade nas buscas</Text>
          <Text style={styles.benefitFeatured}>✓ Estatísticas futuras</Text>

          <Button
            title={
              planoProfissionalAtivo
                ? "Plano profissional ativo"
                : "Simular ativação do plano"
            }
            onPress={simularUpgrade}
            disabled={planoProfissionalAtivo}
          />
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Observação</Text>

          <Text style={styles.infoText}>
            Esta tela prepara a monetização do FazTudo. A cobrança real será
            implementada futuramente com uma plataforma de pagamento.
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

  currentPlanCard: {
    backgroundColor: "#fff7ed",
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: "#ffe0b8",
    marginBottom: 20,
  },

  cardLabel: {
    fontSize: 13,
    color: "#666",
    marginBottom: 6,
  },

  currentPlanTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: "#0A2F73",
    marginBottom: 6,
  },

  statusText: {
    fontSize: 14,
    color: "#555",
  },

  planCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: "#eee",
    marginBottom: 18,
  },

  planCardFeatured: {
    backgroundColor: "#0A2F73",
    borderRadius: 18,
    padding: 20,
    marginBottom: 18,
  },

  planTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: "#0A2F73",
    marginBottom: 6,
  },

  planTitleFeatured: {
    fontSize: 20,
    fontWeight: "900",
    color: "#fff",
    marginBottom: 6,
  },

  planPrice: {
    fontSize: 18,
    fontWeight: "800",
    color: "#ff9100ff",
    marginBottom: 14,
  },

  planPriceFeatured: {
    fontSize: 18,
    fontWeight: "800",
    color: "#ff9100ff",
    marginBottom: 14,
  },

  benefit: {
    fontSize: 14,
    color: "#333",
    marginBottom: 8,
  },

  benefitFeatured: {
    fontSize: 14,
    color: "#fff",
    marginBottom: 8,
  },

  limitation: {
    fontSize: 14,
    color: "#999",
    marginBottom: 8,
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
});