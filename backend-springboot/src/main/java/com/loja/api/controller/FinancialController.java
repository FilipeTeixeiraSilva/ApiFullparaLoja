package com.loja.api.controller;

import java.util.List;

import com.loja.api.dto.FinancialDTO;
import com.loja.api.service.FinancialService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/financial")
@CrossOrigin(origins = "http://localhost:5173")
public class FinancialController {

    @Autowired
    private FinancialService financialService;

    @PostMapping
    public ResponseEntity<FinancialDTO> createRecord(@Valid @RequestBody FinancialDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(financialService.createRecord(dto));
    }

    @GetMapping("/{id}")
    public ResponseEntity<FinancialDTO> getRecordById(@PathVariable Long id) {
        return ResponseEntity.ok(financialService.getRecordById(id));
    }

    @GetMapping
    public ResponseEntity<List<FinancialDTO>> listRecords() {
        return ResponseEntity.ok(financialService.listRecords());
    }

    @PutMapping("/{id}")
    public ResponseEntity<FinancialDTO> updateRecord(@PathVariable Long id, @Valid @RequestBody FinancialDTO dto) {
        return ResponseEntity.ok(financialService.updateRecord(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRecord(@PathVariable Long id) {
        financialService.deleteRecord(id);
        return ResponseEntity.noContent().build();
    }
}
