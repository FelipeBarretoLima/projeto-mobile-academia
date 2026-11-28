import { useEffect, useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import { api, mensagemDeErro } from "../services/api";
import { avisar } from "../utils/alerts";
import { cores } from "../styles/cores";

export default function UsuarioFormScreen({ route, navigation }) {
  const usuario = route.params?.usuario; // undefined = cadastro novo
  const editando = Boolean(usuario);

  const [nome, setNome] = useState(usuario?.nome ?? "");
  const [erro, setErro] = useState("");
  const [salvando, setSalvando] = useState(false);

  // Ajusta o título do cabeçalho conforme o modo
  useEffect(() => {
    navigation.setOptions({ title: editando ? "Editar usuário" : "Novo usuário" });
  }, [editando, navigation]);

  async function salvar() {
    setSalvando(true);
    setErro("");
    try {
      const dados = { nome: nome.trim() };
      if (editando) {
        await api.put(`/usuarios/${usuario.id}`, dados);
        avisar("Sucesso", "Usuário atualizado com sucesso!");
      } else {
        await api.post("/usuarios", dados);
        avisar("Sucesso", "Usuário cadastrado com sucesso!");
      }
      navigation.goBack();
    } catch (e) {
      // Mostra a mensagem de validação enviada pelo back-end (ex.: nome obrigatório)
      setErro(mensagemDeErro(e, "Não foi possível salvar o usuário."));
    } finally {
      setSalvando(false);
    }
  }

  return (
    <View style={styles.tela}>
      <Text style={styles.rotulo}>
        Nome <Text style={styles.obrigatorio}>*</Text>
      </Text>
      <TextInput
        style={[styles.campo, erro && styles.campoComErro]}
        value={nome}
        onChangeText={(texto) => {
          setNome(texto);
          setErro("");
        }}
        placeholder="Ex.: Maria Souza"
        placeholderTextColor={cores.textoSecundario}
        maxLength={100}
      />
      {erro ? <Text style={styles.textoErro}>{erro}</Text> : null}

      <Text style={styles.legenda}>* campo obrigatório</Text>

      <Pressable
        style={[styles.botaoSalvar, salvando && styles.botaoDesativado]}
        onPress={salvar}
        disabled={salvando}
      >
        <Text style={styles.botaoSalvarTexto}>{salvando ? "Salvando..." : "Salvar"}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: cores.fundo,
    padding: 16,
  },
  rotulo: {
    fontSize: 14,
    fontWeight: "600",
    color: cores.texto,
    marginBottom: 6,
  },
  obrigatorio: {
    color: cores.perigo,
  },
  campo: {
    backgroundColor: cores.cartao,
    borderWidth: 1,
    borderColor: cores.borda,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: cores.texto,
  },
  campoComErro: {
    borderColor: cores.perigo,
  },
  textoErro: {
    color: cores.perigo,
    fontSize: 13,
    marginTop: 6,
  },
  legenda: {
    color: cores.textoSecundario,
    fontSize: 12,
    marginTop: 12,
  },
  botaoSalvar: {
    marginTop: 24,
    backgroundColor: cores.primaria,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  botaoDesativado: {
    opacity: 0.6,
  },
  botaoSalvarTexto: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "700",
  },
});