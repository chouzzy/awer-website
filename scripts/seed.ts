import { MongoClient } from 'mongodb';
import 'dotenv/config'; // Carrega o .env automaticamente

async function main() {
  const uri = process.env.HELPAWER_DATABASE_URL;
  if (!uri) throw new Error("HELPAWER_DATABASE_URL não encontrada no .env");

  const client = new MongoClient(uri);

  try {
    await client.connect();
    // Nome do banco de dados (pode ajustar se for outro)
    const db = client.db('help_awer'); 

    console.log('🌱 Conectado ao MongoDB nativo. Iniciando seed...');

    const usersCol = db.collection('users');
    const ticketsCol = db.collection('tickets');

    // 1. Limpeza (Cuidado: apaga tudo dessas coleções!)
    await usersCol.deleteMany({});
    await ticketsCol.deleteMany({});

    // 2. Criar Users
    const usersResult = await usersCol.insertMany([
      {
        email: 'cliente@awer.co',
        name: 'Cliente Teste Awer',
        auth0Id: 'auth0|test-client-123',
        role: 'CLIENT',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        email: 'admin@awer.co',
        name: 'Admin Awer',
        auth0Id: 'auth0|admin-awer-123',
        role: 'ADMIN',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    // O ID do cliente inserido
    const clientId = Object.values(usersResult.insertedIds)[0];

    // 3. Criar Tickets ligados ao cliente
    await ticketsCol.insertMany([
      {
        title: 'Erro na integração da API Stripe',
        description: 'Os webhooks não estão a atualizar o status da subscrição.',
        clientId: clientId, // Ligação relacional
        status: 'OPEN',
        priority: 'HIGH',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Atualização de copy na Landing Page',
        description: 'Precisamos mudar a secção de serviços na home conforme o novo doc.',
        clientId: clientId,
        status: 'IN_PROGRESS',
        priority: 'MEDIUM',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    console.log('✅ Seed finalizado com sucesso! Sem frescuras, direto no banco.');
  } catch (error) {
    console.error('Erro no seed:', error);
  } finally {
    await client.close();
  }
}

main();