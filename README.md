# NestJS RabbitMQ Microservices

Este projeto demonstra uma arquitetura de microsserviços utilizando NestJS e RabbitMQ para comunicação assíncrona entre serviços.

## Funcionalidades

### User Service (Porta 3001)

- **Autenticação JWT**: Login e proteção de rotas
- **CRUD de Usuários**: Criar e buscar usuários
- **Publicação de Eventos**: Envia eventos para RabbitMQ quando um usuário é criado
- **Banco de Dados**: PostgreSQL com TypeORM

### Order Service (Porta 3000)

- **Consumo de Eventos**: Escuta eventos de `user.created` do RabbitMQ
- **Processamento**: Processa dados de novos usuários

### RabbitMQ

- **Exchange**: `user_events` (topic)
- **Filas**: `order_service_user_created`
- **Management UI**: http://localhost:15672 (guest/guest)

## Quick Start

### Pré-requisitos

- Docker e Docker Compose instalados
- Node.js 20+ (para desenvolvimento local)

### Executando com Docker Compose

```bash
# Na raiz do projeto
docker-compose up --build
```

### Verificando os serviços

| Serviço             | URL                    |
| ------------------- | ---------------------- |
| User Service        | http://localhost:3001  |
| Order Service       | http://localhost:3000  |
| RabbitMQ Management | http://localhost:15672 |

## API Endpoints

### User Service

```bash
# Criar usuário
POST http://localhost:3001/users
Content-Type: application/json

{
  "email": "usuario@email.com",
  "password": "senha123",
  "nome": "Nome do Usuário"
}

# Login
POST http://localhost:3001/auth/login
Content-Type: application/json

{
  "email": "usuario@email.com",
  "password": "senha123"
}

# Buscar usuário (requer JWT)
GET http://localhost:3001/users/:id
Authorization: Bearer <token>
```

### Order Service

```bash
# Health check
GET http://localhost:3000
```

## Fluxo de Eventos

1. Cliente cria usuário via `POST /users`
2. User Service salva no PostgreSQL
3. User Service publica evento `user.created` no RabbitMQ
4. Order Service consome o evento da fila
5. Order Service processa os dados do novo usuário

## Variáveis de Ambiente

### User Service

| Variável          | Padrão          | Descrição           |
| ----------------- | --------------- | ------------------- |
| PORT              | 3001            | Porta do serviço    |
| DATABASE_HOST     | postgres-user   | Host do PostgreSQL  |
| DATABASE_PORT     | 5432            | Porta do PostgreSQL |
| DATABASE_USER     | user            | Usuário do banco    |
| DATABASE_PASSWORD | password        | Senha do banco      |
| DATABASE_NAME     | userdb          | Nome do banco       |
| RABBITMQ_HOST     | rabbitmq        | Host do RabbitMQ    |
| JWT_SECRET        | your-secret-key | Chave para JWT      |

### Order Service

| Variável      | Padrão   | Descrição        |
| ------------- | -------- | ---------------- |
| PORT          | 3000     | Porta do serviço |
| RABBITMQ_HOST | rabbitmq | Host do RabbitMQ |

## Comandos Úteis

```bash
# Instalar dependências
cd user-service && npm install
cd order-service && npm install

# Development
cd user-service && npm run start:dev
cd order-service && npm run start:dev

# Executar testes
cd user-service && npm test
cd order-service && npm test
```
