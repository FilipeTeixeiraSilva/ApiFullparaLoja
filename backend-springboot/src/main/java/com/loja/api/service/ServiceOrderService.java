package com.loja.api.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import com.loja.api.dto.ServiceOrderDTO;
import com.loja.api.dto.StatusUpdateDTO;
import com.loja.api.model.CustomerEntity;
import com.loja.api.model.ProductEntity;
import com.loja.api.model.ServiceEntity;
import com.loja.api.model.ServiceOrder;
import com.loja.api.model.ServiceOrderItem;
import com.loja.api.model.enums.StatusSO;
import com.loja.api.repository.CustomerRepository;
import com.loja.api.repository.ProductRepository;
import com.loja.api.repository.ServiceOrderRepository;
import com.loja.api.repository.ServiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ServiceOrderService {

    @Autowired
    private ServiceOrderRepository serviceOrderRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ServiceRepository serviceRepository;

    @Transactional
    public ServiceOrderDTO createServiceOrder(ServiceOrderDTO dto) {
        CustomerEntity customer = customerRepository.findById(dto.getCustomerId())
                .orElseThrow(() -> new RuntimeException("Customer not found with id: " + dto.getCustomerId()));

        ServiceOrder order = new ServiceOrder();
        order.setCustomer(customer);
        order.setOrderDate(LocalDateTime.now());
        order.setStatus(StatusSO.PENDENTE);

        // Associate services
        if (dto.getServicesIds() != null && !dto.getServicesIds().isEmpty()) {
            List<ServiceEntity> services = serviceRepository.findAllById(dto.getServicesIds());
            order.setServices(services);
        } else {
            order.setServices(new ArrayList<>());
        }

        // Build order items and validate stock
        List<ServiceOrderItem> items = new ArrayList<>();
        if (dto.getItems() != null) {
            for (var itemInput : dto.getItems()) {
                ProductEntity product = productRepository.findById(itemInput.getProductId())
                        .orElseThrow(() -> new RuntimeException("Product not found with id: " + itemInput.getProductId()));
                if (product.getStockQuantity() < itemInput.getQuantity()) {
                    throw new RuntimeException("Insufficient stock for product: " + product.getName());
                }
                ServiceOrderItem item = new ServiceOrderItem();
                item.setProduct(product);
                item.setQuantity(itemInput.getQuantity());
                item.setUnitPrice(product.getPrice());
                item.setServiceOrder(order);
                items.add(item);
            }
        }
        order.setItems(items);
        order.setTotalValue(calculateTotal(order));

        return toDTO(serviceOrderRepository.save(order));
    }

    public ServiceOrderDTO getServiceOrderById(Long id) {
        ServiceOrder order = serviceOrderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));
        return toDTO(order);
    }

    public List<ServiceOrderDTO> listServiceOrders() {
        return serviceOrderRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public ServiceOrderDTO updateStatus(Long id, StatusUpdateDTO statusDTO) {
        ServiceOrder order = serviceOrderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));

        if (!isValidTransition(order.getStatus(), statusDTO.getStatus())) {
            throw new RuntimeException("Invalid status transition from " + order.getStatus() + " to " + statusDTO.getStatus());
        }

        if (statusDTO.getStatus() == StatusSO.CONCLUIDO) {
            decrementStock(order);
            order.setCompletedDate(LocalDateTime.now());
        }

        order.setStatus(statusDTO.getStatus());
        return toDTO(serviceOrderRepository.save(order));
    }

    @Transactional
    public void deleteServiceOrder(Long id) {
        ServiceOrder order = serviceOrderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));
        if (order.getStatus() == StatusSO.CONCLUIDO) {
            throw new RuntimeException("Cannot delete a completed order");
        }
        serviceOrderRepository.deleteById(id);
    }

    private boolean isValidTransition(StatusSO current, StatusSO next) {
        return switch (current) {
            case PENDENTE -> next == StatusSO.PROCESSANDO || next == StatusSO.CANCELADO;
            case PROCESSANDO -> next == StatusSO.CONCLUIDO || next == StatusSO.CANCELADO;
            default -> false;
        };
    }

    private void decrementStock(ServiceOrder order) {
        for (ServiceOrderItem item : order.getItems()) {
            ProductEntity product = item.getProduct();
            int newQty = product.getStockQuantity() - item.getQuantity();
            if (newQty < 0) {
                throw new RuntimeException("Insufficient stock for product: " + product.getName());
            }
            product.setStockQuantity(newQty);
            productRepository.save(product);
        }
    }

    private BigDecimal calculateTotal(ServiceOrder order) {
        BigDecimal total = BigDecimal.ZERO;
        if (order.getServices() != null) {
            total = total.add(order.getServices().stream()
                    .map(ServiceEntity::getPrice)
                    .reduce(BigDecimal.ZERO, BigDecimal::add));
        }
        if (order.getItems() != null) {
            total = total.add(order.getItems().stream()
                    .map(i -> i.getUnitPrice().multiply(BigDecimal.valueOf(i.getQuantity())))
                    .reduce(BigDecimal.ZERO, BigDecimal::add));
        }
        return total;
    }

    private ServiceOrderDTO toDTO(ServiceOrder order) {
        ServiceOrderDTO dto = new ServiceOrderDTO();
        dto.setId(order.getId());
        dto.setStatus(order.getStatus());
        dto.setOrderDate(order.getOrderDate());
        dto.setCompletedDate(order.getCompletedDate());
        dto.setTotalValue(order.getTotalValue());
        dto.setCustomerId(order.getCustomer().getId());
        dto.setCustomerName(order.getCustomer().getName());
        if (order.getServices() != null) {
            dto.setServicesIds(order.getServices().stream()
                    .map(ServiceEntity::getId)
                    .collect(Collectors.toList()));
        }
        return dto;
    }
}
