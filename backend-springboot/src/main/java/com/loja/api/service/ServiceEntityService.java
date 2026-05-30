package com.loja.api.service;

import java.util.List;
import java.util.stream.Collectors;

import com.loja.api.dto.ServiceEntityDTO;
import com.loja.api.model.ServiceEntity;
import com.loja.api.repository.ServiceRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ServiceEntityService {

    @Autowired
    private ServiceRepository serviceRepository;

    @Autowired
    private ModelMapper modelMapper;

    public ServiceEntityDTO createService(ServiceEntityDTO dto) {
        ServiceEntity entity = modelMapper.map(dto, ServiceEntity.class);
        return modelMapper.map(serviceRepository.save(entity), ServiceEntityDTO.class);
    }

    public ServiceEntityDTO getServiceById(Long id) {
        ServiceEntity entity = serviceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Service not found with id: " + id));
        return modelMapper.map(entity, ServiceEntityDTO.class);
    }

    public List<ServiceEntityDTO> listServices() {
        return serviceRepository.findAll().stream()
                .map(e -> modelMapper.map(e, ServiceEntityDTO.class))
                .collect(Collectors.toList());
    }

    public ServiceEntityDTO updateService(Long id, ServiceEntityDTO dto) {
        ServiceEntity entity = serviceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Service not found with id: " + id));
        dto.setId(id);
        modelMapper.map(dto, entity);
        return modelMapper.map(serviceRepository.save(entity), ServiceEntityDTO.class);
    }

    public void deleteService(Long id) {
        if (!serviceRepository.existsById(id)) {
            throw new RuntimeException("Service not found with id: " + id);
        }
        serviceRepository.deleteById(id);
    }
}
