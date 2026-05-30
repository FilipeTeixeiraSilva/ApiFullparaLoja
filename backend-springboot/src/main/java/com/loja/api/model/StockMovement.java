package com.loja.api.model;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Data
@Table(name = "stock_movements")
public class StockMovement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // References the product that had stock changed.
    private Long productId;

    @Enumerated(EnumType.STRING)
    private StockMovementType type;

    private Integer quantity;

    private LocalDateTime occurredAt;

    private String reason;

    private String referenceId;

    @PrePersist
    public void prePersist() {
        if (occurredAt == null) {
            occurredAt = LocalDateTime.now();
        }
    }
}
