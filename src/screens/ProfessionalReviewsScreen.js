import React, { useCallback, useEffect, useState } from "react";

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import {
  collection,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";

import { auth, db } from "../services/firebaseConfig";

import AppHeader from "../components/AppHeader";
import Button from "../components/Button";

export default function ProfessionalReviewsScreen({ goTo }) {
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [media, setMedia] = useState(0);
  const [carregando, setCarregando] = useState(true);

  const carregarAvaliacoes = useCallback(async () => {
    try {
      setCarregando(true);

      const user = auth.currentUser;

      if (!user) {
        setAvaliacoes([]);
        setMedia(0);
        goTo("login");
        return;
      }

      const avaliacoesRef = collection(
        db,
        "users",
        user.uid,
        "avaliacoes"
      );

      let avaliacoesSnap;

      try {
        const avaliacoesQuery = query(
          avaliacoesRef,
          orderBy("criadoEm", "desc")
        );

        avaliacoesSnap = await getDocs(avaliacoesQuery);
      } catch (error) {
        /*
          Caso alguma avaliação antiga não possua criadoEm,
          fazemos uma segunda tentativa sem orderBy.
        */
        console.log(
          "Não foi possível ordenar por criadoEm. Carregando sem ordenação:",
          error
        );

        avaliacoesSnap = await getDocs(avaliacoesRef);
      }

      const lista = [];

      avaliacoesSnap.forEach((documento) => {
        const dados = documento.data();

        const notaNumerica = Number(dados.nota);

        if (
          Number.isFinite(notaNumerica) &&
          notaNumerica >= 1 &&
          notaNumerica <= 5
        ) {
          lista.push({
            id: documento.id,
            ...dados,
            nota: notaNumerica,
          });
        }
      });

      /*
        Se a busca precisou ser feita sem orderBy,
        garantimos uma ordenação local pelas datas.
      */
      lista.sort((a, b) => {
        const dataA = obterTimestamp(a.criadoEm);
        const dataB = obterTimestamp(b.criadoEm);

        return dataB - dataA;
      });

      const soma = lista.reduce(
        (total, avaliacao) => total + avaliacao.nota,
        0
      );

      const mediaCalculada =
        lista.length > 0 ? soma / lista.length : 0;

      setAvaliacoes(lista);
      setMedia(mediaCalculada);
    } catch (error) {
      console.log("Erro ao carregar avaliações:", error);

      setAvaliacoes([]);
      setMedia(0);
    } finally {
      setCarregando(false);
    }
  }, [goTo]);

  useEffect(() => {
    carregarAvaliacoes();
  }, [carregarAvaliacoes]);

  const formatarData = (criadoEm) => {
    if (!criadoEm) {
      return "";
    }

    let data;

    if (criadoEm?.toDate) {
      data = criadoEm.toDate();
    } else if (criadoEm instanceof Date) {
      data = criadoEm;
    } else if (typeof criadoEm === "string") {
      data = new Date(criadoEm);
    } else if (criadoEm?.seconds) {
      data = new Date(criadoEm.seconds * 1000);
    }

    if (!data || Number.isNaN(data.getTime())) {
      return "";
    }

    return data.toLocaleDateString("pt-BR");
  };

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

          <Text style={styles.loadingText}>
            Carregando avaliações...
          </Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>
              Média geral
            </Text>

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
                Quando usuários avaliarem seu atendimento,
                os comentários aparecerão aqui.
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

              {avaliacoes.map((avaliacao) => {
                const dataFormatada = formatarData(
                  avaliacao.criadoEm
                );

                return (
                  <View
                    key={avaliacao.id}
                    style={styles.reviewCard}
                  >
                    <View style={styles.reviewHeader}>
                      <Text style={styles.reviewName}>
                        {avaliacao.usuarioNome || "Usuário"}
                      </Text>

                      {dataFormatada ? (
                        <Text style={styles.reviewDate}>
                          {dataFormatada}
                        </Text>
                      ) : null}
                    </View>

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
                );
              })}
            </>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

/*
  Converte diferentes formatos possíveis de timestamp
  do Firestore para milissegundos.
*/
function obterTimestamp(valor) {
  if (!valor) {
    return 0;
  }

  if (valor?.toDate) {
    const data = valor.toDate();

    return data instanceof Date
      ? data.getTime()
      : 0;
  }

  if (valor instanceof Date) {
    return valor.getTime();
  }

  if (valor?.seconds) {
    return valor.seconds * 1000;
  }

  if (typeof valor === "string") {
    const data = new Date(valor);

    return Number.isNaN(data.getTime())
      ? 0
      : data.getTime();
  }

  return 0;
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
    color: "#ff9100",
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

  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },

  reviewName: {
    flex: 1,
    fontSize: 14,
    fontWeight: "800",
    color: "#0A2F73",
  },

  reviewDate: {
    fontSize: 11,
    color: "#999",
    marginLeft: 10,
  },

  reviewStars: {
    fontSize: 18,
    color: "#ff9100",
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