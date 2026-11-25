package br.uel.RegistroTreinos.Repository;

import br.uel.RegistroTreinos.Model.Treino;
import br.uel.RegistroTreinos.Model.Usuario;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TreinoRepository extends JpaRepository<Treino, Long> {

    // Lista os treinos de um usuário, ordenados conforme o Sort recebido
    List<Treino> findByUsuarioId(Long usuarioId, Sort sort);

    // Pesquisa os treinos de um usuário pelo nome do treino (ignora maiúsculas/minúsculas)
    List<Treino> findByUsuarioIdAndNomeTreinoContainingIgnoreCase(Long usuarioId, String nomeTreino, Sort sort);

    // Verifica se já existe um treino com esse usuário, data e nome
    boolean existsByUsuarioAndDateAndNomeTreino(Usuario usuario, LocalDate date, String nomeTreino);

    // Mesma verificação, ignorando o próprio registro (usado na edição)
    boolean existsByUsuarioAndDateAndNomeTreinoAndIdNot(Usuario usuario, LocalDate date, String nomeTreino, Long id);

    // Verifica se o usuário possui treinos (impede excluir usuário com treinos)
    boolean existsByUsuarioId(Long usuarioId);
}