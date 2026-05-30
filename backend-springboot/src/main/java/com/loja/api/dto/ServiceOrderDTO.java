package com.loja.api.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import com.loja.api.model.enums.StatusSO;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ServiceOrderDTO {

    // output
    private Long id;
    private StatusSO status;
    private LocalDateTime orderDate;
    private LocalDateTime completedDate;
    private BigDecimal totalValue;
    private String customerName;

    // input
    @NotNull(message = "Customer ID is required")
    private Long customerId;

    private List<Long> servicesIds;

    @Valid
    private List<ServiceOrderItemInputDTO> items;
}
