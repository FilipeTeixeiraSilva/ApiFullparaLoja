package com.loja.api.service;

import java.util.List;
import java.util.stream.Collectors;

import com.loja.api.dto.ProductDTO;
import com.loja.api.model.ProductEntity;
import com.loja.api.repository.ProductRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ModelMapper modelMapper;

    public ProductDTO createProduct(ProductDTO productDTO) {
        ProductEntity entity = modelMapper.map(productDTO, ProductEntity.class);
        return modelMapper.map(productRepository.save(entity), ProductDTO.class);
    }

    public ProductDTO getProductById(Long id) {
        ProductEntity entity = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
        return modelMapper.map(entity, ProductDTO.class);
    }

    public List<ProductDTO> listProducts() {
        return productRepository.findAll().stream()
                .map(e -> modelMapper.map(e, ProductDTO.class))
                .collect(Collectors.toList());
    }

    public ProductDTO updateProduct(Long id, ProductDTO productDTO) {
        ProductEntity entity = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
        productDTO.setId(id);
        modelMapper.map(productDTO, entity);
        return modelMapper.map(productRepository.save(entity), ProductDTO.class);
    }

    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new RuntimeException("Product not found with id: " + id);
        }
        productRepository.deleteById(id);
    }
}
