package br.uel.RegistroTreinos.Model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Table(name = "item_treino")
@Setter
@Getter
public class ItemTreino {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "treino_id", nullable = false)
    private Treino treino;

    private String nomeExercicio;

    private BigDecimal carga;

    private Integer repeticoes;

    private Integer totalSeries;

    public ItemTreino() {
    }

    public ItemTreino(Treino treino, String nomeExercicio, BigDecimal carga, Integer repeticoes, Integer totalSeries) {
        this.treino = treino;
        this.nomeExercicio = nomeExercicio;
        this.carga = carga;
        this.repeticoes = repeticoes;
        this.totalSeries = totalSeries;
    }
}