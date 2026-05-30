package com.loja.api.dto;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class CustomerDTO {

    private Long id;

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    private String email;

    @NotBlank(message = "Phone is required")
        @Pattern(
            regexp = "^(?:\\+?55\\s?)?\\(?\\d{2}\\)?\\s?(?:9\\d{4}|\\d{4})-?\\d{4}$",
            message = "Phone must be in Brazilian format, for example: (11) 91234-5678")
    private String phone;

    @NotBlank(message = "CPF is required")
    @Pattern(regexp = "^\\d{11}$", message = "CPF must contain 11 digits")
    private String cpf;

    @NotBlank(message = "Address is required")
    private String address;

    @NotNull(message = "Birth date is required")
    @Past(message = "Birth date must be in the past")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd/MM/yyyy")
    private LocalDate birthDate;

}
