package com.loja.api.service;

import java.util.List;
import java.util.stream.Collectors;

import com.loja.api.dto.CustomerDTO;
import com.loja.api.model.CustomerEntity;
import com.loja.api.repository.CustomerRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CustomerService {

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private ModelMapper modelMapper;

    public CustomerDTO createCustomer(CustomerDTO customerDTO) {
        CustomerEntity entity = modelMapper.map(customerDTO, CustomerEntity.class);
        return modelMapper.map(customerRepository.save(entity), CustomerDTO.class);
    }

    public CustomerDTO getCustomerById(Long id) {
        CustomerEntity entity = customerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found with id: " + id));
        return modelMapper.map(entity, CustomerDTO.class);
    }

    public List<CustomerDTO> listCustomers() {
        return customerRepository.findAll().stream()
                .map(e -> modelMapper.map(e, CustomerDTO.class))
                .collect(Collectors.toList());
    }

    public CustomerDTO updateCustomer(Long id, CustomerDTO customerDTO) {
        CustomerEntity entity = customerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found with id: " + id));
        customerDTO.setId(id);
        modelMapper.map(customerDTO, entity);
        return modelMapper.map(customerRepository.save(entity), CustomerDTO.class);
    }

    public void deleteCustomer(Long id) {
        if (!customerRepository.existsById(id)) {
            throw new RuntimeException("Customer not found with id: " + id);
        }
        customerRepository.deleteById(id);
    }
}
