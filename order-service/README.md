# Order Service

Microsserviço NestJS para consumo de eventos do RabbitMQ. Escuta eventos `user.created` publicados pelo user-service.

## Tecnologias

- **Framework**: NestJS (TypeScript)
- **Mensageria**: RabbitMQ (amqplib)
- **Reactive**: RxJS

## Funcionalidades

### Processamento de Eventos

- Consumo de eventos `user.created` do RabbitMQ
- Processamento de dados de novos usuários
- Health check básico

## Endpoints da API

| Método | Endpoint | Descrição    |
| ------ | -------- | ------------ |
| `GET`  | `/`      | Health check |

## RabbitMQ

- **Exchange**: `user_events` (topic exchange)
- **Fila**: `order_service_user_created`
- **Chave de Rota**: `user.created`

**Evento Consumido**:

```json
{
  "event": "user.created",
  "data": { "userId": 1, "email": "usuario@email.com", "nome": "Usuario" },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Instalação

```bash
npm install
```

## Executando a aplicação

```bash
# Desenvolvimento
npm run start

# Modo watch
npm run start:dev

# Produção
npm run start:prod
```

## Configuração

Configure as variáveis de ambiente no arquivo `.env`:

```
RABBITMQ_URL=amqp://localhost:5672
```

## Integração com User Service

Este serviço consome eventos publicados pelo **User Service**.
