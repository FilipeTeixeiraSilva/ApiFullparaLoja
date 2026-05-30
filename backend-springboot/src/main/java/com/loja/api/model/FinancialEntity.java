package com.loja.api.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.loja.api.model.enums.FinancialType;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Data
@Table(name = "financial_records")
public class FinancialEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private FinancialType type;

    private BigDecimal value;
    private String description;
    private LocalDateTime date;
    private Long referenceOrderId;
}
