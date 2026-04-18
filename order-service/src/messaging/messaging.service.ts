import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import * as amqp from 'amqplib';

interface UserCreatedEvent {
  event: string;
  data: {
    userId: number;
    email: string;
    nome: string;
  };
  timestamp: string;
}

@Injectable()
export class MessagingService implements OnModuleInit, OnModuleDestroy {
  private connection: amqp.Connection;
  private channel: amqp.Channel;

  async onModuleInit() {
    await this.connect();
  }

  async onModuleDestroy() {
    if (this.channel) {
      await this.channel.close();
    }
    if (this.connection) {
      await this.connection.close();
    }
  }

  private async connect() {
    let retries = 0;
    const maxRetries = 10;

    while (retries < maxRetries) {
      try {
        this.connection = await amqp.connect('amqp://rabbitmq:5672');
        this.channel = await this.connection.createChannel();

        await this.channel.assertExchange('user_events', 'topic', {
          durable: true,
        });

        console.log('Connected to RabbitMQ from Order Service');
        
        await this.consumeUserCreatedEvents();
        return;
      } catch (error) {
        retries++;
        console.error(`Failed to connect to RabbitMQ (attempt ${retries}/${maxRetries}):`, error.message);
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
    }
  }

  private async consumeUserCreatedEvents() {
    const queue = 'order_service_user_created';
    
    await this.channel.assertQueue(queue, { durable: true });
    
    await this.channel.bindQueue(
      queue,
      'user_events',
      'user.created'
    );

    this.channel.consume(queue, (msg) => {
      if (msg) {
        const event: UserCreatedEvent = JSON.parse(msg.content.toString());
        console.log('Received user.created event:', event);
        
        this.handleUserCreated(event.data);
        
        this.channel.ack(msg);
      }
    });
    
    console.log('Waiting for user.created events...');
  }

  private handleUserCreated(userData: { userId: number; email: string; nome: string }) {
    console.log(`Processing new user: ${userData.nome} (${userData.email})`);
  }
}