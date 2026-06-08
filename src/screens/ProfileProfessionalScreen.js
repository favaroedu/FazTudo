import React, { useEffect, useState } from "react";

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  Linking,
  TouchableOpacity,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  collection,
  getDocs,
  updateDoc,
} from "firebase/firestore";

import { auth, db } from "../services/firebaseConfig";

import AppHeader from "../components/AppHeader";
import Button from "../components/Button";
import Input from "../components/Input";

export default function ProfileProfessionalScreen({
  goTo,
  profissionalId,
  origem = "home",
}) {
  const [profissional, setProfissional] = useState(null);
  const [carregando, setCarregando] = useState(true);

  const [nota, setNota] = useState(0);
  const [comentario, setComentario] = useState("");

  const [mediaAvaliacoes, setMediaAvaliacoes] = useState(0);
  const [totalAvaliacoes, setTotalAvaliacoes] = useState(0);
  const [avaliacoes, setAvaliacoes] = useState([]);

  const visualizacaoProfissional = origem === "homeProfissional";

  const carregarProfissional = async () => {
    if (!profissionalId) {
      Alert.alert("Erro", "Profissional não encontrado.");
      goTo(origem);
      return;
    }

    try {
      const profissionalRef = doc(db, "users", profissionalId);
      const profissionalSnap = await getDoc(profissionalRef);

      if (!profissionalSnap.exists()) {
        Alert.alert("Erro", "Perfil profissional não encontrado.");
        goTo(origem);
        return;
      }

      setProfissional(profissionalSnap.data());
    } catch (error) {
      console.log("Erro ao carregar profissional:", error);
      Alert.alert("Erro", "Não foi possível carregar o perfil.");
    } finally {
      setCarregando(false);
    }
  };

  const carregarAvaliacoes = async () => {
    try {
      if (!profissionalId) return;

      const avaliacoesRef = collection(
        db,
        "users",
        profissionalId,
        "avaliacoes"
      );

      const avaliacoesSnap = await getDocs(avaliacoesRef);

      let soma = 0;
      let total = 0;
      const listaAvaliacoes = [];

      avaliacoesSnap.forEach((documento) => {
        const avaliacao = documento.data();

        if (avaliacao.nota) {
          soma += avaliacao.nota;
          total += 1;

          listaAvaliacoes.push({
            id: documento.id,
            ...avaliacao,
          });
        }
      });

      const novaMedia = total > 0 ? soma / total : 0;

      setTotalAvaliacoes(total);
      setMediaAvaliacoes(novaMedia);
      setAvaliacoes(listaAvaliacoes);

      await updateDoc(doc(db, "users", profissionalId), {
        mediaAvaliacoes: novaMedia,
        totalAvaliacoes: total,
      });
    } catch (error) {
      console.log("Erro ao carregar avaliações:", error);
    }
  };

  useEffect(() => {
    carregarProfissional();
    carregarAvaliacoes();
  }, [profissionalId]);

  const abrirWhatsApp = () => {
    const numero = profissional?.whatsapp || profissional?.telefone;

    if (!numero) {
      Alert.alert(
        "Contato indisponível",
        "Este profissional não informou WhatsApp."
      );
      return;
    }

    const numeroLimpo = numero.replace(/\D/g, "");

    const numeroComPais = numeroLimpo.startsWith("55")
      ? numeroLimpo
      : `55${numeroLimpo}`;

    const mensagem = encodeURIComponent(
      "Olá! Encontrei seu perfil no FazTudoApp!"
    );

    const url = `https://wa.me/${numeroComPais}?text=${mensagem}`;

    Linking.openURL(url).catch(() => {
      Alert.alert("Erro", "Não foi possível abrir o WhatsApp.");
    });
  };

  const adicionarFavorito = async () => {
    try {
      const usuario = auth.currentUser;

      if (!usuario) {
        Alert.alert("Erro", "Você precisa estar logado para favoritar.");
        return;
      }

      if (!profissionalId || !profissional) {
        Alert.alert("Erro", "Profissional não encontrado.");
        return;
      }

      await setDoc(
        doc(db, "users", usuario.uid, "favoritos", profissionalId),
        {
          profissionalId,
          nome: profissional?.nome || "",
          servico: profissional?.servico || "",
          cidade: profissional?.cidade || "",
          uf: profissional?.uf || "",
          telefone: profissional?.telefone || "",
          whatsapp: profissional?.whatsapp || "",
          possuiWhatsapp: profissional?.possuiWhatsapp || false,
          criadoEm: serverTimestamp(),
        }
      );

      Alert.alert("Sucesso", "Profissional adicionado aos favoritos!");
    } catch (error) {
      console.log("Erro ao favoritar:", error);
      Alert.alert("Erro", "Não foi possível adicionar aos favoritos.");
    }
  };

  const salvarAvaliacao = async () => {
    try {
      const usuario = auth.currentUser;

      if (!usuario) {
        Alert.alert("Erro", "Você precisa estar logado para avaliar.");
        return;
      }

      if (!profissionalId) {
        Alert.alert("Erro", "Profissional não encontrado.");
        return;
      }

      if (nota < 1 || nota > 5) {
        Alert.alert("Erro", "Selecione uma nota de 1 a 5 estrelas.");
        return;
      }

      const usuarioRef = doc(db, "users", usuario.uid);
      const usuarioSnap = await getDoc(usuarioRef);

      const usuarioNome = usuarioSnap.exists()
        ? usuarioSnap.data().nome || "Usuário"
        : "Usuário";

      await setDoc(
        doc(db, "users", profissionalId, "avaliacoes", usuario.uid),
        {
          usuarioId: usuario.uid,
          usuarioNome,
          nota,
          comentario: comentario.trim(),
          criadoEm: serverTimestamp(),
        }
      );

      Alert.alert("Sucesso", "Avaliação registrada com sucesso!");

      setComentario("");
      await carregarAvaliacoes();
    } catch (error) {
      console.log("Erro ao salvar avaliação:", error);
      Alert.alert("Erro", "Não foi possível salvar sua avaliação.");
    }
  };

  if (carregando) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <AppHeader
          title="Perfil profissional"
          subtitle="Carregando informações"
          showBack
          onBack={() => goTo(origem)}
          backgroundColor="#0A2F73"
        />

        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0A2F73" />
          <Text style={styles.loadingText}>Carregando perfil...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <AppHeader
        title={
          visualizacaoProfissional
            ? "Visualização do Perfil"
            : "Perfil profissional"
        }
        subtitle={profissional?.servico || "Profissional"}
        showBack
        onBack={() => goTo(origem)}
        backgroundColor="#0A2F73"
      />

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {visualizacaoProfissional && (
          <View style={styles.previewAlert}>
            <Text style={styles.previewAlertTitle}>
              Visualização do seu perfil público
            </Text>

            <Text style={styles.previewAlertText}>
              Esta é a forma como os usuários veem suas informações no FazTudo.
            </Text>
          </View>
        )}

        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {profissional?.nome
                ? profissional.nome.charAt(0).toUpperCase()
                : "P"}
            </Text>
          </View>

          <Text style={styles.name}>
            {profissional?.nome || "Nome não informado"}
          </Text>

          <Text style={styles.service}>
            {profissional?.servico || "Serviço não informado"}
          </Text>

          <Text style={styles.location}>
            {profissional?.cidade || "Cidade não informada"} -{" "}
            {profissional?.uf || "UF"}
          </Text>

          <Text style={styles.rating}>
            ⭐{" "}
            {totalAvaliacoes > 0
              ? `${mediaAvaliacoes.toFixed(1)} (${totalAvaliacoes} avaliação${
                  totalAvaliacoes > 1 ? "ões" : ""
                })`
              : "Ainda sem avaliações"}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sobre o profissional</Text>

          <View style={styles.infoCard}>
            <Text style={styles.infoText}>
              {profissional?.sobreMim?.trim()
                ? profissional.sobreMim
                : `Este profissional atua na área de ${
                    profissional?.servico || "serviços residenciais"
                  } e está disponível para atendimento conforme contato informado.`}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Experiência</Text>

          <InfoItem
            label="Tempo de experiência"
            value={profissional?.experiencia || "Não informado"}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contato</Text>

          <InfoItem label="Telefone" value={profissional?.telefone} />

          <InfoItem
            label="WhatsApp"
            value={
              profissional?.possuiWhatsapp
                ? "Disponível neste número"
                : "Não informado"
            }
          />

          <InfoItem label="Email" value={profissional?.email} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Localização</Text>

          <InfoItem label="Cidade" value={profissional?.cidade} />
          <InfoItem label="Estado" value={profissional?.estado} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Galeria de trabalhos</Text>

          <View style={styles.galleryEmpty}>
            <Text style={styles.galleryIcon}>🖼️</Text>

            <Text style={styles.galleryTitle}>
              Nenhuma foto adicionada ainda
            </Text>

            <Text style={styles.galleryText}>
              Em breve este profissional poderá adicionar fotos dos trabalhos
              realizados.
            </Text>
          </View>
        </View>

        {!visualizacaoProfissional && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Avaliar profissional</Text>

            <View style={styles.ratingBox}>
              <Text style={styles.ratingHelper}>Selecione uma nota:</Text>

              <View style={styles.starsContainer}>
                {[1, 2, 3, 4, 5].map((item) => (
                  <TouchableOpacity key={item} onPress={() => setNota(item)}>
                    <Text style={styles.star}>
                      {item <= nota ? "★" : "☆"}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Input
                placeholder="Comentário sobre o atendimento (opcional)"
                value={comentario}
                onChangeText={setComentario}
                multiline
              />

              <Text style={styles.helperText}>
                Você pode avaliar uma vez. Se avaliar novamente, sua avaliação
                anterior será atualizada.
              </Text>

              <Button
                title="Enviar avaliação"
                onPress={salvarAvaliacao}
                type="secondary"
              />
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Avaliações recebidas</Text>

          {avaliacoes.length === 0 ? (
            <View style={styles.infoCard}>
              <Text style={styles.infoText}>
                Este profissional ainda não recebeu avaliações.
              </Text>
            </View>
          ) : (
            avaliacoes.map((avaliacao) => (
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
            ))
          )}
        </View>

        {!visualizacaoProfissional && (
          <>
            <Button title="Chamar no WhatsApp" onPress={abrirWhatsApp} />

            <Button
              title="Adicionar aos favoritos"
              onPress={adicionarFavorito}
              type="secondary"
            />
          </>
        )}

        <Button
          title={
            visualizacaoProfissional
              ? "Voltar ao painel"
              : "Voltar para resultados"
          }
          onPress={() => goTo(origem)}
          type="secondary"
        />
      </ScrollView>
    </SafeAreaView>
  );
}

function InfoItem({ label, value }) {
  return (
    <View style={styles.infoItem}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value || "Não informado"}</Text>
    </View>
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

  previewAlert: {
    backgroundColor: "#eef4ff",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "#cfe0ff",
    marginBottom: 16,
  },

  previewAlertTitle: {
    color: "#0A2F73",
    fontSize: 15,
    fontWeight: "800",
    marginBottom: 4,
  },

  previewAlertText: {
    color: "#555",
    fontSize: 13,
    lineHeight: 18,
  },

  profileCard: {
    alignItems: "center",
    backgroundColor: "#fff7ed",
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#ffe0b8",
  },

  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: "#0A2F73",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
  },

  avatarText: {
    color: "#fff",
    fontSize: 36,
    fontWeight: "900",
  },

  name: {
    fontSize: 22,
    fontWeight: "800",
    color: "#0A2F73",
    textAlign: "center",
    marginBottom: 4,
  },

  service: {
    fontSize: 15,
    fontWeight: "700",
    color: "#ff9100ff",
    marginBottom: 4,
  },

  location: {
    fontSize: 14,
    color: "#666",
    marginBottom: 6,
  },

  rating: {
    fontSize: 14,
    color: "#555",
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
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 14,
    padding: 14,
  },

  infoText: {
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
  },

  infoItem: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
  },

  infoLabel: {
    fontSize: 12,
    color: "#777",
    marginBottom: 4,
  },

  infoValue: {
    fontSize: 15,
    color: "#222",
    fontWeight: "600",
  },

  galleryEmpty: {
    backgroundColor: "#fff7ed",
    borderRadius: 18,
    padding: 22,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ffe0b8",
  },

  galleryIcon: {
    fontSize: 40,
    marginBottom: 10,
  },

  galleryTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#0A2F73",
    textAlign: "center",
    marginBottom: 6,
  },

  galleryText: {
    fontSize: 13,
    color: "#666",
    textAlign: "center",
    lineHeight: 19,
  },

  ratingBox: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 14,
    padding: 14,
  },

  ratingHelper: {
    color: "#666",
    fontSize: 13,
    marginBottom: 8,
  },

  starsContainer: {
    flexDirection: "row",
    marginBottom: 12,
  },

  star: {
    fontSize: 34,
    color: "#ff9100ff",
    marginRight: 6,
  },

  helperText: {
    color: "#777",
    fontSize: 12,
    lineHeight: 18,
    marginTop: -4,
    marginBottom: 10,
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