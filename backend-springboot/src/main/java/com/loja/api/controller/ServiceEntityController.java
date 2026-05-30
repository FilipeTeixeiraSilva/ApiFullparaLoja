package com.loja.api.controller;

import java.util.List;

import com.loja.api.dto.ServiceEntityDTO;
import com.loja.api.service.ServiceEntityService;
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
@RequestMapping("/services")
@CrossOrigin(origins = "http://localhost:5173")
public class ServiceEntityController {

    @Autowired
    private ServiceEntityService serviceEntityService;

    @PostMapping
    public ResponseEntity<ServiceEntityDTO> createService(@Valid @RequestBody ServiceEntityDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(serviceEntityService.createService(dto));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ServiceEntityDTO> getServiceById(@PathVariable Long id) {
        return ResponseEntity.ok(serviceEntityService.getServiceById(id));
    }

    @GetMapping
    public ResponseEntity<List<ServiceEntityDTO>> listServices() {
        return ResponseEntity.ok(serviceEntityService.listServices());
    }

    @PutMapping("/{id}")
    public ResponseEntity<ServiceEntityDTO> updateService(@PathVariable Long id, @Valid @RequestBody ServiceEntityDTO dto) {
        return ResponseEntity.ok(serviceEntityService.updateService(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteService(@PathVariable Long id) {
        serviceEntityService.deleteService(id);
        return ResponseEntity.noContent().build();
    }
}
