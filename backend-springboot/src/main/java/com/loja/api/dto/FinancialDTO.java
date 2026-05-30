package com.loja.api.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.loja.api.model.enums.FinancialType;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class FinancialDTO {

    private Long id;

    @NotNull(message = "Type is required")
    private FinancialType type;

    @NotNull(message = "Value is required")
    @Positive(message = "Value must be positive")
    private BigDecimal value;

    @NotBlank(message = "Description is required")
    private String description;

    private LocalDateTime date;
    private Long referenceOrderId;
}
