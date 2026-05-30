package com.loja.api.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import com.loja.api.dto.FinancialDTO;
import com.loja.api.model.FinancialEntity;
import com.loja.api.repository.FinancialRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class FinancialService {

    @Autowired
    private FinancialRepository financialRepository;

    @Autowired
    private ModelMapper modelMapper;

    public FinancialDTO createRecord(FinancialDTO dto) {
        FinancialEntity entity = modelMapper.map(dto, FinancialEntity.class);
        if (entity.getDate() == null) {
            entity.setDate(LocalDateTime.now());
        }
        return modelMapper.map(financialRepository.save(entity), FinancialDTO.class);
    }

    public FinancialDTO getRecordById(Long id) {
        FinancialEntity entity = financialRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Financial record not found with id: " + id));
        return modelMapper.map(entity, FinancialDTO.class);
    }

    public List<FinancialDTO> listRecords() {
        return financialRepository.findAll().stream()
                .map(e -> modelMapper.map(e, FinancialDTO.class))
                .collect(Collectors.toList());
    }

    public FinancialDTO updateRecord(Long id, FinancialDTO dto) {
        FinancialEntity entity = financialRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Financial record not found with id: " + id));
        dto.setId(id);
        modelMapper.map(dto, entity);
        return modelMapper.map(financialRepository.save(entity), FinancialDTO.class);
    }

    public void deleteRecord(Long id) {
        if (!financialRepository.existsById(id)) {
            throw new RuntimeException("Financial record not found with id: " + id);
        }
        financialRepository.deleteById(id);
    }
}
