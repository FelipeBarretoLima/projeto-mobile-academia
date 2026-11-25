package br.uel.RegistroTreinos.Service;

import br.uel.RegistroTreinos.Model.Treino;
import br.uel.RegistroTreinos.Model.Usuario;
import br.uel.RegistroTreinos.Repository.ItemTreinoRepository;
import br.uel.RegistroTreinos.Repository.TreinoRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class TreinoService {

    private final TreinoRepository treinoRepository;
    private final ItemTreinoRepository itemTreinoRepository;
    private final UsuarioService usuarioService;

    public TreinoService(TreinoRepository treinoRepository,
                         ItemTreinoRepository itemTreinoRepository,
                         UsuarioService usuarioService) {
        this.treinoRepository = treinoRepository;
        this.itemTreinoRepository = itemTreinoRepository;
        this.usuarioService = usuarioService;
    }

    // Lista os treinos de um usuário, com pesquisa opcional por nome e ordenação por data
    public List<Treino> listarPorUsuario(Long usuarioId, String busca, String direcao) {
        usuarioService.buscarPorID(usuarioId); // garante que o usuário existe (senão, 404)

        Sort sort = "desc".equalsIgnoreCase(direcao)
                ? Sort.by("date").descending()
                : Sort.by("date").ascending();

        if (busca == null || busca.isBlank()) {
            return treinoRepository.findByUsuarioId(usuarioId, sort);
        }
        return treinoRepository.findByUsuarioIdAndNomeTreinoContainingIgnoreCase(usuarioId, busca.trim(), sort);
    }

    public Treino buscarPorId(Long id) {
        return treinoRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Treino não encontrado com id: " + id));
    }

    public Treino salvar(Treino treino) {
        validarDadosBasicos(treino);

        Usuario usuario = usuarioService.buscarPorID(treino.getUsuario().getId());
        treino.setUsuario(usuario);

        boolean duplicado = treinoRepository.existsByUsuarioAndDateAndNomeTreino(
                usuario, treino.getDate(), treino.getNomeTreino());

        if (duplicado) {
            throw new IllegalStateException(
                    "Já existe um treino '" + treino.getNomeTreino() +
                            "' para este usuário nessa data.");
        }

        return treinoRepository.save(treino);
    }

    public Treino atualizar(Long id, Treino dadosAtualizados) {
        Treino treino = buscarPorId(id);
        validarDadosBasicos(dadosAtualizados);

        Usuario usuario = usuarioService.buscarPorID(dadosAtualizados.getUsuario().getId());

        boolean duplicado = treinoRepository.existsByUsuarioAndDateAndNomeTreinoAndIdNot(
                usuario, dadosAtualizados.getDate(), dadosAtualizados.getNomeTreino(), id);

        if (duplicado) {
            throw new IllegalStateException(
                    "Já existe outro treino '" + dadosAtualizados.getNomeTreino() +
                            "' para este usuário nessa data.");
        }

        treino.setUsuario(usuario);
        treino.setDate(dadosAtualizados.getDate());
        treino.setNomeTreino(dadosAtualizados.getNomeTreino());

        return treinoRepository.save(treino);
    }

    // @Transactional: os dois deletes acontecem juntos; se um falhar, nada é apagado
    @Transactional
    public void excluir(Long id) {
        buscarPorId(id); // garante que existe antes de tentar excluir

        itemTreinoRepository.deleteByTreinoId(id);
        treinoRepository.deleteById(id);
    }

    private void validarDadosBasicos(Treino treino) {
        if (treino.getUsuario() == null || treino.getUsuario().getId() == null) {
            throw new IllegalArgumentException("O usuário do treino é obrigatório.");
        }
        if (treino.getDate() == null) {
            throw new IllegalArgumentException("A data do treino é obrigatória.");
        }
        if (treino.getNomeTreino() == null || treino.getNomeTreino().isBlank()) {
            throw new IllegalArgumentException("O nome do treino é obrigatório.");
        }
    }
}