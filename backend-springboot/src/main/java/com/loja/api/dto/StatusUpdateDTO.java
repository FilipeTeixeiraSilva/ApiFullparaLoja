package com.loja.api.dto;

import com.loja.api.model.enums.StatusSO;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class StatusUpdateDTO {

    @NotNull(message = "Status is required")
    private StatusSO status;
}
