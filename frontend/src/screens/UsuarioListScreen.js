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
import UsuarioItem from "../components/UsuarioItem";
import { cores } from "../styles/cores";

export default function UsuarioListScreen({ navigation }) {
  const insets = useSafeAreaInsets(); // tamanho das barras do sistema (ex.: botões do Android)

  const [usuarios, setUsuarios] = useState([]);
  const [textoBusca, setTextoBusca] = useState(""); // o que está digitado no campo
  const [filtro, setFiltro] = useState("");         // a busca que foi aplicada
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  // Recarrega a lista sempre que a tela ganha foco (ex.: ao voltar do formulário)
  // ou quando o filtro de busca muda.
  useFocusEffect(
    useCallback(() => {
      async function carregar() {
        setCarregando(true);
        setErro("");
        try {
          const resposta = await api.get("/usuarios", {
            params: { busca: filtro || undefined },
          });
          setUsuarios(resposta.data);
        } catch (e) {
          setErro(mensagemDeErro(e, "Não foi possível carregar os usuários."));
        } finally {
          setCarregando(false);
        }
      }
      carregar();
    }, [filtro])
  );

  function buscar() {
    setFiltro(textoBusca.trim());
  }

  function limparBusca() {
    setTextoBusca("");
    setFiltro("");
  }

  function excluir(usuario) {
    confirmarExclusao(`Excluir o usuário "${usuario.nome}"?`, async () => {
      try {
        await api.delete(`/usuarios/${usuario.id}`);
        setUsuarios((lista) => lista.filter((u) => u.id !== usuario.id));
        avisar("Sucesso", "Usuário excluído com sucesso!");
      } catch (e) {
        avisar("Erro", mensagemDeErro(e, "Não foi possível excluir o usuário."));
      }
    });
  }

  return (
    <SafeAreaView style={styles.tela} edges={["bottom"]}>
      <View style={styles.barraBusca}>
        <TextInput
          style={styles.campoBusca}
          placeholder="Pesquisar usuário por nome"
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
          data={usuarios}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={[styles.lista, { paddingBottom: insets.bottom + 90 }]}
          renderItem={({ item }) => (
            <UsuarioItem
              usuario={item}
              onEditar={() => navigation.navigate("UsuarioForm", { usuario: item })}
              onExcluir={() => excluir(item)}
            />
          )}
          ListEmptyComponent={
            <Text style={styles.vazio}>
              {filtro ? "Nenhum usuário encontrado." : "Nenhum usuário cadastrado."}
            </Text>
          }
        />
      )}

      <Pressable
        style={[styles.botaoNovo, { bottom: insets.bottom + 16 }]}
        onPress={() => navigation.navigate("UsuarioForm")}
      >
        <Text style={styles.botaoNovoTexto}>+ Novo usuário</Text>
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
  lista: {
    paddingTop: 2,
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