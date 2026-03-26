"use server";

import clientPromise from "@/lib/mongodb";

// Definimos exatamente o que a função vai devolver
interface MongoUser {
  _id: string;
  auth0UserId: string;
  email: string;
  name: string;
}

export async function getOrCreateMongoUser(auth0UserId: string, email: string): Promise<MongoUser> {
  const client = await clientPromise;
  const db = client.db("help_awer");
  const usersCol = db.collection("users");

  // Procuramos o user
  const user = await usersCol.findOne({ auth0UserId });

  if (!user) {
    const newUser = {
      auth0UserId,
      email,
      name: email.split('@')[0],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const result = await usersCol.insertOne(newUser);
    
    return { 
      ...newUser, 
      _id: result.insertedId.toString() 
    } as MongoUser;
  }

  // Se o user existir, garantimos que devolvemos os campos que o TS espera
  return {
    _id: user._id.toString(),
    auth0UserId: user.auth0UserId,
    email: user.email,
    name: user.name || user.email.split('@')[0], // Fallback caso o nome não exista no banco
  } as MongoUser;
}