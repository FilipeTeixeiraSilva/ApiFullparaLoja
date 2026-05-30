package com.loja.api.controller;

import java.util.List;

import com.loja.api.dto.ServiceOrderDTO;
import com.loja.api.dto.StatusUpdateDTO;
import com.loja.api.service.ServiceOrderService;
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
@RequestMapping("/orders")
@CrossOrigin(origins = "http://localhost:5173")
public class ServiceOrderController {

    @Autowired
    private ServiceOrderService serviceOrderService;

    @PostMapping
    public ResponseEntity<ServiceOrderDTO> createOrder(@Valid @RequestBody ServiceOrderDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(serviceOrderService.createServiceOrder(dto));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ServiceOrderDTO> getOrderById(@PathVariable Long id) {
        return ResponseEntity.ok(serviceOrderService.getServiceOrderById(id));
    }

    @GetMapping
    public ResponseEntity<List<ServiceOrderDTO>> listOrders() {
        return ResponseEntity.ok(serviceOrderService.listServiceOrders());
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ServiceOrderDTO> updateStatus(@PathVariable Long id, @Valid @RequestBody StatusUpdateDTO statusDTO) {
        return ResponseEntity.ok(serviceOrderService.updateStatus(id, statusDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrder(@PathVariable Long id) {
        serviceOrderService.deleteServiceOrder(id);
        return ResponseEntity.noContent().build();
    }
}
