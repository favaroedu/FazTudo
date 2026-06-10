import React, { useEffect, useState } from "react";

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { auth, db } from "../services/firebaseConfig";

import AppHeader from "../components/AppHeader";
import Button from "../components/Button";

export default function ProfessionalReviewsScreen({ goTo }) {
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [media, setMedia] = useState(0);
  const [carregando, setCarregando] = useState(true);

  const carregarAvaliacoes = async () => {
    try {
      const user = auth.currentUser;

      if (!user) return;

      const avaliacoesRef = collection(
        db,
        "users",
        user.uid,
        "avaliacoes"
      );

      const avaliacoesSnap = await getDocs(avaliacoesRef);

      let soma = 0;
      let total = 0;
      const lista = [];

      avaliacoesSnap.forEach((documento) => {
        const avaliacao = documento.data();

        if (avaliacao.nota) {
          soma += avaliacao.nota;
          total += 1;

          lista.push({
            id: documento.id,
            ...avaliacao,
          });
        }
      });

      setAvaliacoes(lista);
      setMedia(total > 0 ? soma / total : 0);
    } catch (error) {
      console.log("Erro ao carregar avaliações:", error);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarAvaliacoes();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <AppHeader
        title="Minhas Avaliações"
        subtitle="Veja sua reputação no FazTudo"
        showBack
        onBack={() => goTo("homeProfissional")}
        backgroundColor="#0A2F73"
      />

      {carregando ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0A2F73" />
          <Text style={styles.loadingText}>Carregando avaliações...</Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Média geral</Text>

            <Text style={styles.summaryRating}>
              ⭐ {avaliacoes.length > 0 ? media.toFixed(1) : "0.0"}
            </Text>

            <Text style={styles.summaryText}>
              {avaliacoes.length} avaliação
              {avaliacoes.length === 1 ? "" : "ões"} recebida
              {avaliacoes.length === 1 ? "" : "s"}
            </Text>
          </View>

          {avaliacoes.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyIcon}>☆</Text>

              <Text style={styles.emptyTitle}>
                Você ainda não recebeu avaliações
              </Text>

              <Text style={styles.emptyText}>
                Quando usuários avaliarem seu atendimento, os comentários
                aparecerão aqui.
              </Text>

              <Button
                title="Voltar ao painel"
                onPress={() => goTo("homeProfissional")}
              />
            </View>
          ) : (
            <>
              <Text style={styles.sectionTitle}>
                Avaliações recebidas
              </Text>

              {avaliacoes.map((avaliacao) => (
                <View key={avaliacao.id} style={styles.reviewCard}>
                  <Text style={styles.reviewName}>
                    {avaliacao.usuarioNome || "Usuário"}
                  </Text>

                  <Text style={styles.reviewStars}>
                    {"★".repeat(avaliacao.nota)}
                    {"☆".repeat(5 - avaliacao.nota)}
                  </Text>

                  {avaliacao.comentario ? (
                    <Text style={styles.reviewComment}>
                      {avaliacao.comentario}
                    </Text>
                  ) : (
                    <Text style={styles.reviewCommentMuted}>
                      Sem comentário.
                    </Text>
                  )}
                </View>
              ))}
            </>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  loadingText: {
    marginTop: 12,
    color: "#666",
  },

  container: {
    padding: 20,
    paddingBottom: 35,
  },

  summaryCard: {
    backgroundColor: "#fff7ed",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ffe0b8",
    marginBottom: 24,
  },

  summaryTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0A2F73",
    marginBottom: 8,
  },

  summaryRating: {
    fontSize: 34,
    fontWeight: "900",
    color: "#0A2F73",
    marginBottom: 6,
  },

  summaryText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },

  emptyCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#eee",
  },

  emptyIcon: {
    fontSize: 48,
    color: "#ff9100ff",
    marginBottom: 10,
  },

  emptyTitle: {
    fontSize: 21,
    fontWeight: "800",
    color: "#0A2F73",
    textAlign: "center",
    marginBottom: 8,
  },

  emptyText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 20,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#0A2F73",
    marginBottom: 12,
  },

  reviewCard: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
  },

  reviewName: {
    fontSize: 14,
    fontWeight: "800",
    color: "#0A2F73",
    marginBottom: 4,
  },

  reviewStars: {
    fontSize: 18,
    color: "#ff9100ff",
    marginBottom: 6,
  },

  reviewComment: {
    fontSize: 13,
    color: "#555",
    lineHeight: 19,
  },

  reviewCommentMuted: {
    fontSize: 13,
    color: "#999",
    fontStyle: "italic",
  },
});