package com.loja.api.model;

import java.math.BigDecimal;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Data
@Table(name = "order_items")
public class ServiceOrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer quantity;
    private BigDecimal unitPrice;

    @ManyToOne
    @JoinColumn(name = "order_id")
    private ServiceOrder serviceOrder;

    @ManyToOne
    @JoinColumn(name = "product_id")
    private ProductEntity product;
}
