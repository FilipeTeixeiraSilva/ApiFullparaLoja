# 🛒 ApiFullparaLoja — Sistema de Gestão de Loja

> API RESTful completa com painel web para gestão de clientes, produtos, serviços, pedidos e financeiro.

![Spring Boot](https://img.shields.io/badge/Spring%20Boot-4.x-6DB33F?logo=springboot&logoColor=white)
![Java](https://img.shields.io/badge/Java-17-ED8B00?logo=openjdk&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-8.x-4479A1?logo=mysql&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7.x-646CFF?logo=vite&logoColor=white)
![Maven](https://img.shields.io/badge/Maven-Wrapper-C71A36?logo=apachemaven&logoColor=white)
![Status](https://img.shields.io/badge/Status-Em%20Desenvolvimento-yellow)

---

## 📋 Índice

- [Visão Geral](#-visão-geral)
- [Arquitetura](#-arquitetura)
- [Tecnologias](#-tecnologias)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Pré-requisitos](#-pré-requisitos)
- [Configuração e Instalação](#-configuração-e-instalação)
- [Executando o Projeto](#-executando-o-projeto)
- [Endpoints da API](#-endpoints-da-api)
- [Fluxo de Status dos Pedidos](#-fluxo-de-status-dos-pedidos)
- [Módulos do Sistema](#-módulos-do-sistema)

---

## 🎯 Visão Geral

Sistema fullstack de gestão para lojas, com backend em **Spring Boot** expondo uma API REST e frontend em **React + TypeScript** para operação via navegador. O sistema cobre o ciclo completo: cadastro de clientes e produtos, lançamento de pedidos com controle automático de estoque e registro de movimentações financeiras.

| Módulo | Funcionalidades |
|---|---|
| **Clientes** | Cadastro completo com CPF, endereço e data de nascimento |
| **Produtos** | Catálogo com preço, categoria e controle de estoque |
| **Serviços** | Serviços avulsos que podem ser adicionados a pedidos |
| **Pedidos** | Criação com produtos e serviços, fluxo de status, cálculo automático de total |
| **Financeiro** | Lançamento de receitas e despesas com resumo de saldo |

---

## 🏗️ Arquitetura

```
[Navegador]
     │
     │  HTTP (Axios)
     ▼
[React + TypeScript]          localhost:5173
     │  (Vite Dev Server)
     │
     │  REST API (JSON)
     ▼
[Spring Boot API]             localhost:8080
     │
     │  Spring Data JPA (Hibernate)
     ▼
[MySQL Database]              localhost:3306/lojaDatabase
```

### Arquitetura do Backend

```
Controller  →  Service  →  Repository  →  Entity (JPA)
     │              │
  DTO (entrada    Regras de negócio:
   e saída)       - Validação de status
                  - Decremento de estoque
                  - Cálculo de total do pedido
```

---

## 🛠️ Tecnologias

### Backend
| Tecnologia | Versão | Uso |
|---|---|---|
| Java | 17 | Linguagem principal |
| Spring Boot | 4.x | Framework web e IoC |
| Spring Data JPA | — | Persistência e repositórios |
| Hibernate | — | ORM / geração do schema |
| MySQL Connector | — | Driver do banco de dados |
| Lombok | — | Redução de boilerplate |
| ModelMapper | 3.2.1 | Mapeamento DTO ↔ Entity |
| spring-dotenv | 4.0.0 | Carregamento de variáveis de ambiente via `.env` |
| Maven Wrapper | — | Build e gerenciamento de dependências |

### Frontend
| Tecnologia | Versão | Uso |
|---|---|---|
| React | 19.2 | Interface de usuário |
| TypeScript | 5.9 | Tipagem estática |
| Vite | 7.x | Build tool e dev server |
| Axios | 1.13 | Requisições HTTP |

---

## 📁 Estrutura do Projeto

```
ApiFullparaLoja/
├── backend-springboot/               ← API Spring Boot
│   ├── src/main/java/com/loja/api/
│   │   ├── config/
│   │   │   └── ModelMapperConfig.java
│   │   ├── controller/
│   │   │   ├── CustomerController.java
│   │   │   ├── ProductController.java
│   │   │   ├── ServiceEntityController.java
│   │   │   ├── ServiceOrderController.java
│   │   │   └── FinancialController.java
│   │   ├── dto/
│   │   │   ├── CustomerDTO.java
│   │   │   ├── ProductDTO.java
│   │   │   ├── ServiceEntityDTO.java
│   │   │   ├── ServiceOrderDTO.java
│   │   │   ├── ServiceOrderItemInputDTO.java
│   │   │   ├── StatusUpdateDTO.java
│   │   │   └── FinancialDTO.java
│   │   ├── model/
│   │   │   ├── CustomerEntity.java
│   │   │   ├── ProductEntity.java
│   │   │   ├── ServiceEntity.java
│   │   │   ├── ServiceOrder.java
│   │   │   ├── ServiceOrderItem.java
│   │   │   ├── FinancialEntity.java
│   │   │   ├── StockMovement.java
│   │   │   ├── StockMovementType.java
│   │   │   └── enums/
│   │   │       ├── StatusSO.java
│   │   │       └── FinancialType.java
│   │   ├── repository/
│   │   │   ├── CustomerRepository.java
│   │   │   ├── ProductRepository.java
│   │   │   ├── ServiceRepository.java
│   │   │   ├── ServiceOrderRepository.java
│   │   │   └── FinancialRepository.java
│   │   └── service/
│   │       ├── CustomerService.java
│   │       ├── ProductService.java
│   │       ├── ServiceEntityService.java
│   │       ├── ServiceOrderService.java
│   │       └── FinancialService.java
│   ├── src/main/resources/
│   │   ├── application.properties          ← gerado localmente (git-ignored)
│   │   └── application.properties.example  ← modelo comitado no repositório
│   ├── .env                                ← credenciais locais (git-ignored)
│   ├── pom.xml
│   └── mvnw / mvnw.cmd
│
└── frontend-react/                   ← Painel React + TypeScript
    ├── src/
    │   ├── pages/
    │   │   ├── CustomerPage.tsx
    │   │   ├── ProductPage.tsx
    │   │   ├── ServicePage.tsx
    │   │   ├── OrderPage.tsx
    │   │   └── FinancialPage.tsx
    │   ├── styles/
    │   │   └── entity.css
    │   ├── App.tsx
    │   ├── main.tsx
    │   └── index.css
    ├── package.json
    └── vite.config.ts
```

---

## ✅ Pré-requisitos

- [Java 17+](https://adoptium.net/)
- [MySQL 8+](https://dev.mysql.com/downloads/) rodando localmente
- [Node.js 18+](https://nodejs.org/)
- Maven não é necessário — o projeto usa o **Maven Wrapper** (`mvnw`)

---

## ⚙️ Configuração e Instalação

### 1. Banco de dados

Crie o banco no MySQL (o Hibernate cria as tabelas automaticamente):

```sql
CREATE DATABASE lojaDatabase;
```

### 2. Configurar credenciais do banco

Crie o arquivo `backend-springboot/.env` com suas credenciais locais (não é comitado no git):

```env
DB_URL=jdbc:mysql://localhost:3306/lojaDatabase?useSSL=false&serverTimezone=UTC
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
```

Em seguida, copie o arquivo de exemplo para gerar o `application.properties`:

```powershell
cp backend-springboot/src/main/resources/application.properties.example backend-springboot/src/main/resources/application.properties
```

> O plugin **spring-dotenv** carrega o `.env` automaticamente ao subir a aplicação — nenhuma configuração extra necessária.

### 3. Instalar dependências do frontend

```powershell
cd frontend-react
npm install
```

---

## 🚀 Executando o Projeto

Abra dois terminais em paralelo:

### Terminal 1 — Backend (porta 8080)

```powershell
cd backend-springboot
.\mvnw.cmd spring-boot:run
```

### Terminal 2 — Frontend (porta 5173)

```powershell
cd frontend-react
npm run dev
```

Acesse o painel em: **http://localhost:5173**

---

## 📡 Endpoints da API

Base URL: `http://localhost:8080`

### Clientes
| Método | Endpoint | Descrição |
|---|---|---|
| `GET` | `/customers` | Listar todos |
| `GET` | `/customers/{id}` | Buscar por ID |
| `POST` | `/customers` | Cadastrar |
| `PUT` | `/customers/{id}` | Atualizar |
| `DELETE` | `/customers/{id}` | Remover |

### Produtos
| Método | Endpoint | Descrição |
|---|---|---|
| `GET` | `/products` | Listar todos |
| `GET` | `/products/{id}` | Buscar por ID |
| `POST` | `/products` | Cadastrar |
| `PUT` | `/products/{id}` | Atualizar |
| `DELETE` | `/products/{id}` | Remover |

### Serviços
| Método | Endpoint | Descrição |
|---|---|---|
| `GET` | `/services` | Listar todos |
| `GET` | `/services/{id}` | Buscar por ID |
| `POST` | `/services` | Cadastrar |
| `PUT` | `/services/{id}` | Atualizar |
| `DELETE` | `/services/{id}` | Remover |

### Pedidos
| Método | Endpoint | Descrição |
|---|---|---|
| `GET` | `/orders` | Listar todos |
| `GET` | `/orders/{id}` | Buscar por ID |
| `POST` | `/orders` | Criar pedido |
| `PUT` | `/orders/{id}/status` | Atualizar status |
| `DELETE` | `/orders/{id}` | Remover (apenas não concluídos) |

### Financeiro
| Método | Endpoint | Descrição |
|---|---|---|
| `GET` | `/financial` | Listar registros |
| `GET` | `/financial/{id}` | Buscar por ID |
| `POST` | `/financial` | Cadastrar registro |
| `PUT` | `/financial/{id}` | Atualizar |
| `DELETE` | `/financial/{id}` | Remover |

---

## 🔄 Fluxo de Status dos Pedidos

```
              ┌─────────────┐
              │   PENDENTE  │  ← status inicial ao criar
              └──────┬──────┘
                     │
                     ▼
           ┌──────────────────┐
           │   PROCESSANDO    │
           └────────┬─────────┘
                    │
          ┌─────────┴──────────┐
          ▼                    ▼
   ┌────────────┐      ┌────────────┐
   │  CONCLUIDO │      │  CANCELADO │
   └────────────┘      └────────────┘
```

> Ao marcar um pedido como **CONCLUIDO**, o sistema desconta automaticamente o estoque de todos os produtos do pedido.
> Pedidos com status **CONCLUIDO** não podem ser removidos.

---

## 📦 Módulos do Sistema

### Pedido — Exemplo de payload (POST /orders)

```json
{
  "customerId": 1,
  "servicesIds": [2, 3],
  "items": [
    { "productId": 1, "quantity": 2 },
    { "productId": 4, "quantity": 1 }
  ]
}
```

### Atualização de status (PUT /orders/{id}/status)

```json
{
  "status": "PROCESSANDO"
}
```

### Cliente — Exemplo de payload (POST /customers)

```json
{
  "name": "João Silva",
  "email": "joao@email.com",
  "phone": "(11) 91234-5678",
  "cpf": "12345678901",
  "address": "Rua das Flores, 123",
  "birthDate": "15/06/1990"
}
```

> **Atenção:** a data de nascimento deve estar no formato `dd/MM/yyyy`.

---

## 📝 Observações

- O CORS está configurado para aceitar requisições de `http://localhost:5173`
- O schema do banco é gerado/atualizado automaticamente pelo Hibernate (`ddl-auto=update`)
- Validações de entrada são aplicadas nos DTOs via Bean Validation (`@NotBlank`, `@Email`, etc.)
- As credenciais ficam em `backend-springboot/.env` (git-ignored) — nunca commite esse arquivo
- O `application.properties` também é git-ignored; use `application.properties.example` como referência
