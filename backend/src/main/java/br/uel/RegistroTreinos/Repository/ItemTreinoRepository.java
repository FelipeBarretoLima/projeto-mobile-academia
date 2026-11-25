package br.uel.RegistroTreinos.Repository;

import br.uel.RegistroTreinos.Model.ItemTreino;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ItemTreinoRepository extends JpaRepository<ItemTreino, Long> {

    // Lista os exercícios de um treino, ordenados conforme o Sort recebido
    List<ItemTreino> findByTreinoId(Long treinoId, Sort sort);

    // Pesquisa os exercícios de um treino pelo nome (ignora maiúsculas/minúsculas)
    List<ItemTreino> findByTreinoIdAndNomeExercicioContainingIgnoreCase(Long treinoId, String nomeExercicio, Sort sort);

    // Remove todos os exercícios de um treino
    void deleteByTreinoId(Long treinoId);
}