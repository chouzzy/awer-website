"use server";

import clientPromise from "@/lib/mongodb";
import { fileUploadService } from "@/lib/fileService";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { ObjectId } from "mongodb";

// Schema apenas para os dados em texto (os ficheiros validamos à parte)
const ticketSchema = z.object({
  title: z.string().min(5),
  description: z.string().min(10),
  clientId: z.string().min(1),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).default("MEDIUM"),
});

export async function createTicket(formData: FormData) {
  try {
    // 1. Extrair e validar dados de texto
    const rawData = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      clientId: formData.get("clientId") as string,
      priority: formData.get("priority") as string,
    };

    const validatedData = ticketSchema.parse(rawData);

    // 2. Processar Anexos (Arquivos)
    const files = formData.getAll("attachments") as File[];
    const uploadedAttachments = [];

    for (const file of files) {
      // Ignora campos de arquivo vazios (caso o user não anexe nada)
      if (file.size === 0) continue;

      // Converte o Web File para NodeJS Buffer
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Faz o upload para o DigitalOcean Spaces
      const fileUrl = await fileUploadService.upload(
        buffer,
        file.name,
        "tickets", // Pasta no DO Spaces
        file.type
      );

      uploadedAttachments.push({
        url: fileUrl,
        fileName: file.name,
        mimeType: file.type,
        uploadedAt: new Date(),
      });
    }

    // 3. Salvar no MongoDB Nativo
    const client = await clientPromise;
    const db = client.db("help_awer");
    const ticketsCol = db.collection("tickets");

    const newTicket = {
      title: validatedData.title,
      description: validatedData.description,
      priority: validatedData.priority,
      clientId: new ObjectId(validatedData.clientId), // <-- A CORREÇÃO ESTÁ AQUI
      status: "OPEN",
      attachments: uploadedAttachments,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await ticketsCol.insertOne(newTicket);

    // 4. Invalida a cache para atualizar a interface imediatamente
    revalidatePath("/awer-admin/tickets");
    revalidatePath("/help");

    return { success: true, ticketId: result.insertedId.toString() };

  } catch (error) {
    console.error("Erro ao criar chamado:", error);
    return { success: false, error: "Falha ao criar o chamado. Verifique os dados." };
  }
}

export async function updateTicketStatus(ticketId: string, newStatus: string) {
  try {
    const client = await clientPromise;
    const db = client.db("help_awer");

    await db.collection("tickets").updateOne(
      { _id: new ObjectId(ticketId) },
      {
        $set: {
          status: newStatus,
          updatedAt: new Date()
        }
      }
    );

    // Invalida as caches para refletir a mudança instantaneamente nos dois lados
    revalidatePath("/awer-admin/tickets");
    revalidatePath("/help");

    return { success: true };
  } catch (error) {
    console.error("Erro ao atualizar status:", error);
    return { success: false, error: "Falha ao atualizar o estado do chamado." };
  }
}

export async function addTicketMessage(ticketId: string, content: string, sender: { name: string, role: "ADMIN" | "CLIENT" }) {
  try {
    const client = await clientPromise;
    const db = client.db("help_awer");
    
    const newMessage = {
      id: new ObjectId().toString(),
      content,
      senderName: sender.name,
      senderRole: sender.role,
      createdAt: new Date(),
    };

    // Adiciona a mensagem ao array 'messages' do ticket específico
    await db.collection("tickets").updateOne(
      { _id: new ObjectId(ticketId) },
      { 
        $push: { messages: newMessage } as any, // Adiciona ao fim da lista
        $set: { updatedAt: new Date() }
      }
    );

    // Invalida as rotas de detalhes para a mensagem aparecer na hora
    revalidatePath(`/awer-admin/tickets/${ticketId}`);
    revalidatePath(`/help/${ticketId}`); // Para o lado do cliente (quando criarmos)

    return { success: true };
  } catch (error) {
    console.error("Erro ao adicionar mensagem:", error);
    return { success: false, error: "Falha ao enviar a mensagem." };
  }
}