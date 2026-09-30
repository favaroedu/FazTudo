import React, { useState } from "react";

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  Linking,
  TouchableOpacity,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import AppHeader from "../components/AppHeader";
import Button from "../components/Button";
import Input from "../components/Input";

export default function AgendaScreen({ goTo }) {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const [compromissos, setCompromissos] = useState([]);

  const [cliente, setCliente] = useState("");
  const [servico, setServico] = useState("");
  const [data, setData] = useState("");
  const [horario, setHorario] = useState("");
  const [endereco, setEndereco] = useState("");
  const [numero, setNumero] = useState("");
  const [complemento, setComplemento] = useState("");
  const [observacoes, setObservacoes] = useState("");

  const [editandoId, setEditandoId] = useState(null);

  // ==========================================
  // LIMPAR FORMULÁRIO
  // ==========================================

  const limparFormulario = () => {
    setCliente("");
    setServico("");
    setData("");
    setHorario("");
    setEndereco("");
    setNumero("");
    setComplemento("");
    setObservacoes("");
    setEditandoId(null);
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
  // SALVAR COMPROMISSO
  // ==========================================

  const salvarCompromisso = () => {
    if (!cliente.trim()) {
      Alert.alert("Atenção", "Informe o nome do cliente.");
      return;
    }

    if (!servico.trim()) {
      Alert.alert("Atenção", "Informe o serviço.");
      return;
    }

    if (!data.trim()) {
      Alert.alert("Atenção", "Informe a data.");
      return;
    }

    if (!horario.trim()) {
      Alert.alert("Atenção", "Informe o horário.");
      return;
    }

    const compromisso = {
      id: editandoId || Date.now().toString(),
      cliente: cliente.trim(),
      servico: servico.trim(),
      data: data.trim(),
      horario: horario.trim(),
      endereco: endereco.trim(),
      numero: numero.trim(),
      complemento: complemento.trim(),
      observacoes: observacoes.trim(),
    };

    if (editandoId) {
      setCompromissos((lista) =>
        lista.map((item) =>
          item.id === editandoId ? compromisso : item
        )
      );

      Alert.alert(
        "Sucesso",
        "Compromisso atualizado com sucesso!"
      );
    } else {
      setCompromissos((lista) => [...lista, compromisso]);

      Alert.alert(
        "Sucesso",
        "Compromisso adicionado à sua agenda!"
      );
    }

    limparFormulario();
    setMostrarFormulario(false);
  };

  // ==========================================
  // EDITAR COMPROMISSO
  // ==========================================

  const editarCompromisso = (item) => {
    setCliente(item.cliente);
    setServico(item.servico);
    setData(item.data);
    setHorario(item.horario);
    setEndereco(item.endereco);
    setNumero(item.numero);
    setComplemento(item.complemento);
    setObservacoes(item.observacoes);

    setEditandoId(item.id);
    setMostrarFormulario(true);
  };

  // ==========================================
  // EXCLUIR COMPROMISSO
  // ==========================================

  const excluirCompromisso = (id) => {
    Alert.alert(
      "Excluir compromisso?",
      "Esse compromisso será removido da sua agenda.",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Excluir",
          style: "destructive",
          onPress: () => {
            setCompromissos((lista) =>
              lista.filter((item) => item.id !== id)
            );
          },
        },
      ]
    );
  };

  // ==========================================
  // ABRIR NAVEGAÇÃO
  // ==========================================

  const abrirNavegacao = async (item) => {
    if (!item.endereco) {
      Alert.alert(
        "Endereço não informado",
        "Este compromisso não possui um endereço cadastrado."
      );

      return;
    }

    const enderecoCompleto = [
      item.endereco,
      item.numero,
      item.complemento,
    ]
      .filter(Boolean)
      .join(", ");

    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      enderecoCompleto
    )}`;

    try {
      const podeAbrir = await Linking.canOpenURL(url);

      if (podeAbrir) {
        await Linking.openURL(url);
      } else {
        Alert.alert(
          "Erro",
          "Não foi possível abrir o aplicativo de mapas."
        );
      }
    } catch (error) {
      console.log("Erro ao abrir navegação:", error);

      Alert.alert(
        "Erro",
        "Não foi possível abrir a localização."
      );
    }
  };

  // ==========================================
  // FORMATAÇÃO DO ENDEREÇO
  // ==========================================

  const montarEndereco = (item) => {
    const partes = [
      item.endereco,
      item.numero,
      item.complemento,
    ].filter(Boolean);

    return partes.length > 0
      ? partes.join(", ")
      : "Endereço não informado";
  };

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <SafeAreaView style={styles.safeArea}>
      <AppHeader
        title="Minha Agenda"
        subtitle="Organize seus atendimentos"
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
            {/* CABEÇALHO DA AGENDA */}
            {/* ========================================== */}

            <View style={styles.introCard}>
              <Text style={styles.introTitle}>
                Organize seus compromissos
              </Text>

              <Text style={styles.introText}>
                Cadastre seus atendimentos e tenha as informações
                dos seus clientes sempre à mão.
              </Text>
            </View>

            {/* ========================================== */}
            {/* BOTÃO ADICIONAR */}
            {/* ========================================== */}

            <Button
              title="+ Adicionar compromisso"
              onPress={abrirFormulario}
            />

            {/* ========================================== */}
            {/* LISTA DE COMPROMISSOS */}
            {/* ========================================== */}

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                Meus compromissos
              </Text>

              {compromissos.length === 0 ? (
                <View style={styles.emptyCard}>
                  <Text style={styles.emptyIcon}>📅</Text>

                  <Text style={styles.emptyTitle}>
                    Sua agenda está vazia
                  </Text>

                  <Text style={styles.emptyText}>
                    Adicione seu primeiro compromisso para começar
                    a organizar seus atendimentos.
                  </Text>
                </View>
              ) : (
                compromissos.map((item) => (
                  <View
                    key={item.id}
                    style={styles.appointmentCard}
                  >
                    {/* DATA E HORÁRIO */}

                    <View style={styles.dateBox}>
                      <Text style={styles.dateText}>
                        {item.data}
                      </Text>

                      <Text style={styles.timeText}>
                        {item.horario}
                      </Text>
                    </View>

                    {/* INFORMAÇÕES */}

                    <View style={styles.appointmentContent}>
                      <Text style={styles.clientName}>
                        {item.cliente}
                      </Text>

                      <Text style={styles.serviceText}>
                        {item.servico}
                      </Text>

                      <Text style={styles.addressText}>
                        📍 {montarEndereco(item)}
                      </Text>

                      {item.observacoes ? (
                        <Text style={styles.observationText}>
                          📝 {item.observacoes}
                        </Text>
                      ) : null}

                      {/* AÇÕES */}

                      <View style={styles.actionsRow}>
                        {item.endereco ? (
                          <TouchableOpacity
                            style={styles.navigateButton}
                            onPress={() =>
                              abrirNavegacao(item)
                            }
                          >
                            <Text
                              style={styles.navigateButtonText}
                            >
                              🧭 Navegar
                            </Text>
                          </TouchableOpacity>
                        ) : null}

                        <TouchableOpacity
                          style={styles.editButton}
                          onPress={() =>
                            editarCompromisso(item)
                          }
                        >
                          <Text style={styles.editButtonText}>
                            ✏️ Editar
                          </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={styles.deleteButton}
                          onPress={() =>
                            excluirCompromisso(item.id)
                          }
                        >
                          <Text
                            style={styles.deleteButtonText}
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
                  ? "Editar compromisso"
                  : "Novo compromisso"}
              </Text>

              <Text style={styles.formSubtitle}>
                Preencha as informações do atendimento.
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
                Serviço
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
                onChangeText={setData}
                keyboardType="numeric"
                maxLength={10}
              />

              {/* HORÁRIO */}

              <Text style={styles.label}>
                Horário
              </Text>

              <Input
                placeholder="Ex.: 09:00"
                value={horario}
                onChangeText={setHorario}
                keyboardType="numeric"
                maxLength={5}
              />

              {/* ENDEREÇO */}

              <Text style={styles.formSectionTitle}>
                📍 Local do atendimento
              </Text>

              <Text style={styles.optionalText}>
                O endereço é opcional.
              </Text>

              <Text style={styles.label}>
                Endereço
              </Text>

              <Input
                placeholder="Rua, avenida, etc."
                value={endereco}
                onChangeText={setEndereco}
              />

              {/* NÚMERO */}

              <Text style={styles.label}>
                Número
              </Text>

              <Input
                placeholder="Número"
                value={numero}
                onChangeText={setNumero}
                keyboardType="numeric"
              />

              {/* COMPLEMENTO */}

              <Text style={styles.label}>
                Complemento / referência
              </Text>

              <Input
                placeholder="Ex.: Casa azul, próximo ao mercado"
                value={complemento}
                onChangeText={setComplemento}
              />

              {/* OBSERVAÇÕES */}

              <Text style={styles.formSectionTitle}>
                📝 Observações
              </Text>

              <Input
                placeholder="Alguma informação importante sobre o atendimento"
                value={observacoes}
                onChangeText={setObservacoes}
                multiline
              />

              {/* BOTÕES */}

              <Button
                title={
                  editandoId
                    ? "Salvar alterações"
                    : "Adicionar compromisso"
                }
                onPress={salvarCompromisso}
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
  // CARD DO COMPROMISSO
  // ==========================================

  appointmentCard: {
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

  timeText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "900",
    marginTop: 5,
  },

  appointmentContent: {
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

  addressText: {
    fontSize: 13,
    color: "#555",
    lineHeight: 18,
    marginBottom: 4,
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

  navigateButton: {
    backgroundColor: "#0A2F73",
    borderRadius: 9,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },

  navigateButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "800",
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

  optionalText: {
    fontSize: 12,
    color: "#888",
    marginBottom: 12,
  },
});