import React, { useEffect, useState } from "react";

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";

import { auth, db } from "../services/firebaseConfig";

import AppHeader from "../components/AppHeader";
import Button from "../components/Button";
import Input from "../components/Input";

export default function HistoricoScreen({ goTo }) {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const [historicos, setHistoricos] = useState([]);

  const [cliente, setCliente] = useState("");
  const [servico, setServico] = useState("");
  const [data, setData] = useState("");
  const [valor, setValor] = useState("");
  const [observacoes, setObservacoes] = useState("");

  const [editandoId, setEditandoId] = useState(null);

  // ==========================================
  // CARREGAR HISTÓRICO DO FIREBASE
  // ==========================================

  useEffect(() => {
    const usuario = auth.currentUser;

    if (!usuario) {
      Alert.alert(
        "Sessão não encontrada",
        "Faça login novamente para acessar seu histórico."
      );

      goTo("login");

      return;
    }

    const historicoRef = collection(
      db,
      "users",
      usuario.uid,
      "historico"
    );

    const unsubscribe = onSnapshot(
      historicoRef,
      (snapshot) => {
        const lista = snapshot.docs.map((documento) => ({
          id: documento.id,
          ...documento.data(),
        }));

        // Mantém os registros mais recentes primeiro
        lista.sort((a, b) => {
          const tempoA = a.criadoEm?.toMillis
            ? a.criadoEm.toMillis()
            : 0;

          const tempoB = b.criadoEm?.toMillis
            ? b.criadoEm.toMillis()
            : 0;

          return tempoB - tempoA;
        });

        setHistoricos(lista);
      },
      (error) => {
        console.log(
          "Erro ao carregar histórico:",
          error
        );

        Alert.alert(
          "Erro",
          "Não foi possível carregar seu histórico."
        );
      }
    );

    return () => unsubscribe();
  }, []);

  // ==========================================
  // LIMPAR FORMULÁRIO
  // ==========================================

  const limparFormulario = () => {
    setCliente("");
    setServico("");
    setData("");
    setValor("");
    setObservacoes("");
    setEditandoId(null);
  };

  // ==========================================
  // FORMATAÇÃO DA DATA
  // ==========================================

  const formatarData = (texto) => {
    const apenasNumeros = texto
      .replace(/\D/g, "")
      .slice(0, 8);

    if (apenasNumeros.length <= 2) {
      return apenasNumeros;
    }

    if (apenasNumeros.length <= 4) {
      return `${apenasNumeros.slice(
        0,
        2
      )}/${apenasNumeros.slice(2)}`;
    }

    return `${apenasNumeros.slice(
      0,
      2
    )}/${apenasNumeros.slice(
      2,
      4
    )}/${apenasNumeros.slice(4)}`;
  };

  // ==========================================
  // FORMATAÇÃO DO VALOR
  // ==========================================

  const formatarValor = (texto) => {
    const apenasNumeros = texto.replace(
      /\D/g,
      ""
    );

    if (!apenasNumeros) {
      return "";
    }

    const valorNumerico =
      parseInt(apenasNumeros, 10) / 100;

    return valorNumerico.toLocaleString(
      "pt-BR",
      {
        style: "currency",
        currency: "BRL",
      }
    );
  };

  // ==========================================
  // ABRIR FORMULÁRIO
  // ==========================================

  const abrirFormulario = () => {
    limparFormulario();
    setMostrarFormulario(true);
  };

  // ==========================================
  // CANCELAR FORMULÁRIO
  // ==========================================

  const cancelarFormulario = () => {
    limparFormulario();
    setMostrarFormulario(false);
  };

  // ==========================================
  // SALVAR HISTÓRICO
  // ==========================================

  const salvarHistorico = async () => {
    if (!cliente.trim()) {
      Alert.alert(
        "Atenção",
        "Informe o nome do cliente."
      );
      return;
    }

    if (!servico.trim()) {
      Alert.alert(
        "Atenção",
        "Informe o serviço realizado."
      );
      return;
    }

    if (!data.trim()) {
      Alert.alert(
        "Atenção",
        "Informe a data."
      );
      return;
    }

    if (!valor.trim()) {
      Alert.alert(
        "Atenção",
        "Informe o valor recebido."
      );
      return;
    }

    const usuario = auth.currentUser;

    if (!usuario) {
      Alert.alert(
        "Sessão expirada",
        "Faça login novamente para continuar."
      );

      goTo("login");

      return;
    }

    const dadosHistorico = {
      cliente: cliente.trim(),
      servico: servico.trim(),
      data: data.trim(),
      valor: valor.trim(),
      observacoes: observacoes.trim(),
    };

    try {
      // ==========================================
      // EDITAR
      // ==========================================

      if (editandoId) {
        const historicoRef = doc(
          db,
          "users",
          usuario.uid,
          "historico",
          editandoId
        );

        await updateDoc(
          historicoRef,
          dadosHistorico
        );

        Alert.alert(
          "Sucesso",
          "Registro atualizado com sucesso!"
        );
      }

      // ==========================================
      // NOVO REGISTRO
      // ==========================================

      else {
        const historicoRef = collection(
          db,
          "users",
          usuario.uid,
          "historico"
        );

        await addDoc(historicoRef, {
          ...dadosHistorico,
          criadoEm: serverTimestamp(),
        });

        Alert.alert(
          "Sucesso",
          "Serviço adicionado ao histórico!"
        );
      }

      limparFormulario();
      setMostrarFormulario(false);
    } catch (error) {
      console.log(
        "Erro ao salvar histórico:",
        error
      );

      Alert.alert(
        "Erro ao salvar",
        `${error.code || "sem código"}\n\n${
          error.message ||
          "Não foi possível salvar o registro."
        }`
      );
    }
  };

  // ==========================================
  // EDITAR HISTÓRICO
  // ==========================================

  const editarHistorico = (item) => {
    setCliente(item.cliente || "");
    setServico(item.servico || "");
    setData(item.data || "");
    setValor(item.valor || "");
    setObservacoes(item.observacoes || "");

    setEditandoId(item.id);
    setMostrarFormulario(true);
  };

  // ==========================================
  // EXCLUIR HISTÓRICO
  // ==========================================

  const excluirHistorico = (id) => {
    Alert.alert(
      "Excluir registro?",
      "Este serviço será removido do seu histórico.",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Excluir",
          style: "destructive",

          onPress: async () => {
            const usuario = auth.currentUser;

            if (!usuario) {
              Alert.alert(
                "Sessão expirada",
                "Faça login novamente para continuar."
              );

              goTo("login");

              return;
            }

            try {
              const historicoRef = doc(
                db,
                "users",
                usuario.uid,
                "historico",
                id
              );

              await deleteDoc(historicoRef);

              Alert.alert(
                "Sucesso",
                "Registro excluído com sucesso!"
              );
            } catch (error) {
              console.log(
                "Erro ao excluir histórico:",
                error
              );

              Alert.alert(
                "Erro",
                "Não foi possível excluir o registro."
              );
            }
          },
        },
      ]
    );
  };

  // ==========================================
  // TOTAL RECEBIDO
  // ==========================================

  const calcularTotal = () => {
    return historicos.reduce((total, item) => {
      const valorNumerico = parseFloat(
        String(item.valor || "")
          .replace("R$", "")
          .replace(/\./g, "")
          .replace(",", ".")
          .trim()
      );

      return (
        total +
        (isNaN(valorNumerico)
          ? 0
          : valorNumerico)
      );
    }, 0);
  };

  const totalRecebido = calcularTotal();

  const totalFormatado =
    totalRecebido.toLocaleString(
      "pt-BR",
      {
        style: "currency",
        currency: "BRL",
      }
    );

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <SafeAreaView style={styles.safeArea}>
      <AppHeader
        title="Histórico"
        subtitle="Controle seus serviços realizados"
        showBack
        onBack={() => goTo("homeProfissional")}
        backgroundColor="#0A2F73"
      />

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {!mostrarFormulario ? (
          <>
            {/* ========================================== */}
            {/* CABEÇALHO */}
            {/* ========================================== */}

            <View style={styles.introCard}>
              <Text style={styles.introTitle}>
                Serviços realizados
              </Text>

              <Text style={styles.introText}>
                Registre os serviços que você já
                realizou para manter seu histórico
                organizado.
              </Text>
            </View>

            {/* ========================================== */}
            {/* RESUMO */}
            {/* ========================================== */}

            {historicos.length > 0 ? (
              <View style={styles.summaryCard}>
                <View style={styles.summaryItem}>
                  <Text
                    style={styles.summaryNumber}
                  >
                    {historicos.length}
                  </Text>

                  <Text
                    style={styles.summaryLabel}
                  >
                    {historicos.length === 1
                      ? "Serviço realizado"
                      : "Serviços realizados"}
                  </Text>
                </View>

                <View
                  style={styles.summaryDivider}
                />

                <View style={styles.summaryItem}>
                  <Text
                    style={styles.summaryValue}
                  >
                    {totalFormatado}
                  </Text>

                  <Text
                    style={styles.summaryLabel}
                  >
                    Total recebido
                  </Text>
                </View>
              </View>
            ) : null}

            {/* ========================================== */}
            {/* BOTÃO ADICIONAR */}
            {/* ========================================== */}

            <Button
              title="+ Adicionar serviço realizado"
              onPress={abrirFormulario}
            />

            {/* ========================================== */}
            {/* LISTA */}
            {/* ========================================== */}

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                Meu histórico
              </Text>

              {historicos.length === 0 ? (
                <View style={styles.emptyCard}>
                  <Text style={styles.emptyIcon}>
                    📋
                  </Text>

                  <Text style={styles.emptyTitle}>
                    Seu histórico está vazio
                  </Text>

                  <Text style={styles.emptyText}>
                    Adicione seu primeiro serviço
                    realizado para começar a registrar
                    seu histórico.
                  </Text>
                </View>
              ) : (
                historicos.map((item) => (
                  <View
                    key={item.id}
                    style={styles.historyCard}
                  >
                    {/* DATA */}

                    <View style={styles.dateBox}>
                      <Text style={styles.dateText}>
                        {item.data}
                      </Text>
                    </View>

                    {/* INFORMAÇÕES */}

                    <View
                      style={styles.historyContent}
                    >
                      <Text
                        style={styles.clientName}
                      >
                        {item.cliente}
                      </Text>

                      <Text
                        style={styles.serviceText}
                      >
                        {item.servico}
                      </Text>

                      <Text
                        style={styles.valueText}
                      >
                        💰 {item.valor}
                      </Text>

                      {item.observacoes ? (
                        <Text
                          style={
                            styles.observationText
                          }
                        >
                          📝 {item.observacoes}
                        </Text>
                      ) : null}

                      {/* AÇÕES */}

                      <View
                        style={styles.actionsRow}
                      >
                        <TouchableOpacity
                          style={styles.editButton}
                          onPress={() =>
                            editarHistorico(item)
                          }
                        >
                          <Text
                            style={
                              styles.editButtonText
                            }
                          >
                            ✏️ Editar
                          </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={styles.deleteButton}
                          onPress={() =>
                            excluirHistorico(
                              item.id
                            )
                          }
                        >
                          <Text
                            style={
                              styles.deleteButtonText
                            }
                          >
                            🗑️
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                ))
              )}
            </View>
          </>
        ) : (
          <>
            {/* ========================================== */}
            {/* FORMULÁRIO */}
            {/* ========================================== */}

            <View style={styles.formCard}>
              <Text style={styles.formTitle}>
                {editandoId
                  ? "Editar serviço"
                  : "Novo serviço realizado"}
              </Text>

              <Text style={styles.formSubtitle}>
                Registre as informações do serviço
                realizado.
              </Text>

              {/* CLIENTE */}

              <Text style={styles.label}>
                Cliente
              </Text>

              <Input
                placeholder="Nome do cliente"
                value={cliente}
                onChangeText={setCliente}
              />

              {/* SERVIÇO */}

              <Text style={styles.label}>
                Serviço realizado
              </Text>

              <Input
                placeholder="Ex.: Instalação elétrica"
                value={servico}
                onChangeText={setServico}
              />

              {/* DATA */}

              <Text style={styles.label}>
                Data
              </Text>

              <Input
                placeholder="DD/MM/AAAA"
                value={data}
                onChangeText={(texto) =>
                  setData(formatarData(texto))
                }
                keyboardType="numeric"
                maxLength={10}
              />

              {/* VALOR */}

              <Text style={styles.label}>
                Valor recebido
              </Text>

              <Input
                placeholder="R$ 0,00"
                value={valor}
                onChangeText={(texto) =>
                  setValor(
                    formatarValor(texto)
                  )
                }
                keyboardType="numeric"
              />

              {/* OBSERVAÇÕES */}

              <Text
                style={styles.formSectionTitle}
              >
                📝 Observações
              </Text>

              <Input
                placeholder="Alguma informação importante sobre o serviço"
                value={observacoes}
                onChangeText={setObservacoes}
                multiline
              />

              {/* BOTÕES */}

              <Button
                title={
                  editandoId
                    ? "Salvar alterações"
                    : "Adicionar serviço"
                }
                onPress={salvarHistorico}
              />

              <Button
                title="Cancelar"
                onPress={cancelarFormulario}
                type="secondary"
              />
            </View>
          </>
        )}
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

  // ==========================================
  // INTRO
  // ==========================================

  introCard: {
    backgroundColor: "#fff7ed",
    borderRadius: 18,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#ffe0b8",
  },

  introTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0A2F73",
    marginBottom: 8,
  },

  introText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#555",
  },

  // ==========================================
  // RESUMO
  // ==========================================

  summaryCard: {
    flexDirection: "row",
    backgroundColor: "#0A2F73",
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 10,
    marginBottom: 16,
    alignItems: "center",
  },

  summaryItem: {
    flex: 1,
    alignItems: "center",
  },

  summaryNumber: {
    fontSize: 24,
    fontWeight: "900",
    color: "#fff",
  },

  summaryValue: {
    fontSize: 18,
    fontWeight: "900",
    color: "#fff",
  },

  summaryLabel: {
    fontSize: 12,
    color: "#fff",
    opacity: 0.85,
    marginTop: 4,
    textAlign: "center",
  },

  summaryDivider: {
    width: 1,
    height: 45,
    backgroundColor: "#ffffff55",
  },

  // ==========================================
  // SEÇÃO
  // ==========================================

  section: {
    marginTop: 24,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0A2F73",
    marginBottom: 12,
  },

  // ==========================================
  // ESTADO VAZIO
  // ==========================================

  emptyCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 28,
    borderWidth: 1,
    borderColor: "#eee",
    alignItems: "center",
  },

  emptyIcon: {
    fontSize: 42,
    marginBottom: 10,
  },

  emptyTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#0A2F73",
    marginBottom: 6,
    textAlign: "center",
  },

  emptyText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    textAlign: "center",
  },

  // ==========================================
  // CARD DO HISTÓRICO
  // ==========================================

  historyCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#eee",
    padding: 14,
    marginBottom: 14,
  },

  dateBox: {
    width: 82,
    minHeight: 82,
    borderRadius: 14,
    backgroundColor: "#0A2F73",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 6,
    marginRight: 12,
  },

  dateText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "800",
    textAlign: "center",
  },

  historyContent: {
    flex: 1,
  },

  clientName: {
    fontSize: 17,
    fontWeight: "800",
    color: "#0A2F73",
    marginBottom: 3,
  },

  serviceText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#ff9100",
    marginBottom: 6,
  },

  valueText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#16803c",
    marginBottom: 5,
  },

  observationText: {
    fontSize: 13,
    color: "#666",
    lineHeight: 18,
    marginBottom: 8,
  },

  // ==========================================
  // AÇÕES
  // ==========================================

  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 7,
    marginTop: 6,
  },

  editButton: {
    backgroundColor: "#fff7ed",
    borderRadius: 9,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#ffe0b8",
  },

  editButtonText: {
    color: "#0A2F73",
    fontSize: 12,
    fontWeight: "800",
  },

  deleteButton: {
    width: 38,
    height: 36,
    borderRadius: 9,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
  },

  deleteButtonText: {
    fontSize: 15,
  },

  // ==========================================
  // FORMULÁRIO
  // ==========================================

  formCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: "#eee",
  },

  formTitle: {
    fontSize: 21,
    fontWeight: "800",
    color: "#0A2F73",
    marginBottom: 5,
  },

  formSubtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
  },

  label: {
    fontSize: 14,
    fontWeight: "700",
    color: "#444",
    marginBottom: 6,
  },

  formSectionTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#0A2F73",
    marginTop: 10,
    marginBottom: 4,
  },
});