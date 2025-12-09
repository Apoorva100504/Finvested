import { Kafka } from 'kafkajs';

class KafkaService {
  constructor() {
    this.isConnected = false;
    this.retryCount = 0;
    this.maxRetries = 5;
    
    this.kafka = new Kafka({
      clientId: 'finvested-backend',
      brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
      connectionTimeout: 5000, // 5 seconds
      requestTimeout: 30000,   // 30 seconds
      retry: {
        initialRetryTime: 300,
        retries: 10
      }
    });
    
    this.producer = this.kafka.producer();
  }

  async connect() {
    try {
      console.log('🔌 Connecting to Kafka...');
      await this.producer.connect();
      this.isConnected = true;
      this.retryCount = 0;
      console.log('✅ Kafka producer connected successfully');
      return true;
    } catch (error) {
      console.error('❌ Kafka connection failed:', error.message);
      this.isConnected = false;
      
      // Retry logic
      if (this.retryCount < this.maxRetries) {
        this.retryCount++;
        console.log(`🔄 Retrying Kafka connection (${this.retryCount}/${this.maxRetries})...`);
        await new Promise(resolve => setTimeout(resolve, 2000));
        return this.connect();
      }
      
      return false;
    }
  }

  async sendMessage(topic, message) {
    if (!this.isConnected) {
      console.log(`⚠️ Kafka not connected, attempting to reconnect...`);
      const connected = await this.connect();
      if (!connected) {
        console.log(`❌ Cannot send message, Kafka unavailable`);
        return false;
      }
    }
    
    try {
      const result = await this.producer.send({
        topic,
        messages: [{ value: JSON.stringify(message) }]
      });
      console.log(`📤 Kafka: Successfully sent to topic "${topic}"`);
      console.log(`   Message:`, JSON.stringify(message).substring(0, 100) + '...');
      return true;
    } catch (error) {
      console.error(`❌ Kafka send failed:`, error.message);
      this.isConnected = false;
      return false;
    }
  }
}

export default new KafkaService();