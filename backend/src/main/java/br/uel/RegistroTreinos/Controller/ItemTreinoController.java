package br.uel.RegistroTreinos.Controller;

import br.uel.RegistroTreinos.Model.ItemTreino;
import br.uel.RegistroTreinos.Service.ItemTreinoService;
import br.uel.RegistroTreinos.Service.TreinoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/treinos/{treinoId}/itens")
public class ItemTreinoController {

    private final ItemTreinoService itemTreinoService;
    private final TreinoService treinoService;

    public ItemTreinoController(ItemTreinoService itemTreinoService, TreinoService treinoService) {
        this.itemTreinoService = itemTreinoService;
        this.treinoService = treinoService;
    }

    // GET /api/treinos/{treinoId}/itens?busca=texto&direcao=asc|desc
    @GetMapping
    public ResponseEntity<List<ItemTreino>> listar(@PathVariable Long treinoId,
                                                   @RequestParam(required = false) String busca,
                                                   @RequestParam(defaultValue = "asc") String direcao) {
        return ResponseEntity.ok(itemTreinoService.listarPorTreino(treinoId, busca, direcao));
    }

    // GET /api/treinos/{treinoId}/itens/{id}
    @GetMapping("/{id}")
    public ResponseEntity<ItemTreino> buscarPorId(@PathVariable Long treinoId, @PathVariable Long id) {
        return ResponseEntity.ok(itemTreinoService.buscarPorId(id));
    }

    // POST /api/treinos/{treinoId}/itens
    @PostMapping
    public ResponseEntity<ItemTreino> cadastrar(@PathVariable Long treinoId, @RequestBody ItemTreino item) {
        item.setTreino(treinoService.buscarPorId(treinoId));
        ItemTreino salvo = itemTreinoService.salvar(item);
        return ResponseEntity.status(HttpStatus.CREATED).body(salvo);
    }

    // PUT /api/treinos/{treinoId}/itens/{id}
    @PutMapping("/{id}")
    public ResponseEntity<ItemTreino> atualizar(@PathVariable Long treinoId, @PathVariable Long id,
                                                @RequestBody ItemTreino item) {
        item.setTreino(treinoService.buscarPorId(treinoId));
        return ResponseEntity.ok(itemTreinoService.atualizar(id, item));
    }

    // DELETE /api/treinos/{treinoId}/itens/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long treinoId, @PathVariable Long id) {
        itemTreinoService.excluir(id);
        return ResponseEntity.noContent().build();
    }
}