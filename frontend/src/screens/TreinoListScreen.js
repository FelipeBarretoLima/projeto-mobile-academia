import { useCallback, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { api, mensagemDeErro } from "../services/api";
import { avisar, confirmarExclusao } from "../utils/alerts";
import TreinoItem from "../components/TreinoItem";
import { cores } from "../styles/cores";

export default function TreinoListScreen({ route, navigation }) {
  const { usuario } = route.params; // usuário escolhido na tela anterior
  const insets = useSafeAreaInsets();

  const [treinos, setTreinos] = useState([]);
  const [textoBusca, setTextoBusca] = useState("");
  const [filtro, setFiltro] = useState("");
  const [direcao, setDirecao] = useState("desc"); // "desc" = mais recentes primeiro
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  // Recarrega ao ganhar foco e sempre que a busca ou a ordenação mudam
  useFocusEffect(
    useCallback(() => {
      async function carregar() {
        setCarregando(true);
        setErro("");
        try {
          const resposta = await api.get(`/usuarios/${usuario.id}/treinos`, {
            params: { busca: filtro || undefined, direcao },
          });
          setTreinos(resposta.data);
        } catch (e) {
          setErro(mensagemDeErro(e, "Não foi possível carregar os treinos."));
        } finally {
          setCarregando(false);
        }
      }
      carregar();
    }, [usuario.id, filtro, direcao])
  );

  function buscar() {
    setFiltro(textoBusca.trim());
  }

  function limparBusca() {
    setTextoBusca("");
    setFiltro("");
  }

  function alternarOrdem() {
    setDirecao((atual) => (atual === "desc" ? "asc" : "desc"));
  }

  function excluir(treino) {
    confirmarExclusao(
      `Excluir o treino "${treino.nomeTreino}" e todos os seus exercícios?`,
      async () => {
        try {
          await api.delete(`/usuarios/${usuario.id}/treinos/${treino.id}`);
          setTreinos((lista) => lista.filter((t) => t.id !== treino.id));
          avisar("Sucesso", "Treino excluído com sucesso!");
        } catch (e) {
          avisar("Erro", mensagemDeErro(e, "Não foi possível excluir o treino."));
        }
      }
    );
  }

  return (
    <SafeAreaView style={styles.tela} edges={["bottom"]}>
      <View style={styles.barraBusca}>
        <TextInput
          style={styles.campoBusca}
          placeholder="Pesquisar treino por nome"
          placeholderTextColor={cores.textoSecundario}
          value={textoBusca}
          onChangeText={setTextoBusca}
          onSubmitEditing={buscar}
          returnKeyType="search"
        />
        <Pressable style={styles.botaoBuscar} onPress={buscar}>
          <Text style={styles.botaoBuscarTexto}>Buscar</Text>
        </Pressable>
      </View>

      <View style={styles.linhaOrdem}>
        <Text style={styles.rotuloOrdem}>Ordenar por data:</Text>
        <Pressable style={styles.botaoOrdem} onPress={alternarOrdem}>
          <Text style={styles.botaoOrdemTexto}>
            {direcao === "desc" ? "Mais recentes ↓" : "Mais antigos ↑"}
          </Text>
        </Pressable>
      </View>

      {filtro ? (
        <Pressable onPress={limparBusca}>
          <Text style={styles.filtroAtivo}>
            Resultados para "{filtro}" · <Text style={styles.limpar}>Limpar</Text>
          </Text>
        </Pressable>
      ) : null}

      {erro ? (
        <View style={styles.caixaErro}>
          <Text style={styles.textoErro}>{erro}</Text>
        </View>
      ) : null}

      {carregando ? (
        <ActivityIndicator size="large" color={cores.primaria} style={styles.carregando} />
      ) : (
        <FlatList
          data={treinos}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={{ paddingBottom: insets.bottom + 90 }}
          renderItem={({ item }) => (
            <TreinoItem
              treino={item}
              onEditar={() =>
                navigation.navigate("TreinoForm", { usuarioId: usuario.id, treino: item })
              }
              onExcluir={() => excluir(item)}
            />
          )}
          ListEmptyComponent={
            <Text style={styles.vazio}>
              {filtro ? "Nenhum treino encontrado." : "Nenhum treino cadastrado."}
            </Text>
          }
        />
      )}

      <Pressable
        style={[styles.botaoNovo, { bottom: insets.bottom + 16 }]}
        onPress={() => navigation.navigate("TreinoForm", { usuarioId: usuario.id })}
      >
        <Text style={styles.botaoNovoTexto}>+ Novo treino</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: cores.fundo,
    paddingHorizontal: 16,
  },
  barraBusca: {
    flexDirection: "row",
    marginTop: 14,
    marginBottom: 8,
  },
  campoBusca: {
    flex: 1,
    backgroundColor: cores.cartao,
    borderWidth: 1,
    borderColor: cores.borda,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: cores.texto,
  },
  botaoBuscar: {
    marginLeft: 8,
    backgroundColor: cores.cabecalho,
    borderRadius: 10,
    paddingHorizontal: 16,
    justifyContent: "center",
  },
  botaoBuscarTexto: {
    color: "#FFF",
    fontWeight: "600",
  },
  linhaOrdem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  rotuloOrdem: {
    color: cores.textoSecundario,
  },
  botaoOrdem: {
    borderWidth: 1,
    borderColor: cores.primaria,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  botaoOrdemTexto: {
    color: cores.primariaEscura,
    fontWeight: "600",
  },
  filtroAtivo: {
    color: cores.textoSecundario,
    marginBottom: 8,
  },
  limpar: {
    color: cores.primariaEscura,
    fontWeight: "600",
  },
  caixaErro: {
    backgroundColor: cores.erroFundo,
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
  },
  textoErro: {
    color: cores.perigo,
  },
  carregando: {
    marginTop: 40,
  },
  vazio: {
    textAlign: "center",
    color: cores.textoSecundario,
    marginTop: 40,
  },
  botaoNovo: {
    position: "absolute",
    left: 16,
    right: 16,
    backgroundColor: cores.primaria,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  botaoNovoTexto: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "700",
  },
});