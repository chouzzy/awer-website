import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage"; 

const spacesEndpoint = process.env.SPACES_ENDPOINT!; 
const region = spacesEndpoint ? spacesEndpoint.split('.')[0] : 'nyc3'; 
const accessKeyId = process.env.SPACES_ACCESS_KEY!;
const secretAccessKey = process.env.SPACES_SECRET_KEY!;
const bucketName = process.env.SPACES_BUCKET_NAME!;

const appFolder = process.env.SPACES_APP_FOLDER || 'mazzotini-dev';

if (!spacesEndpoint || !accessKeyId || !secretAccessKey || !bucketName) {
    console.warn("[File Service] As credenciais do DigitalOcean Spaces não estão configuradas.");
}

const s3Client = new S3Client({
    endpoint: `https://${spacesEndpoint}`,
    region: region,
    credentials: {
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey
    }
});

class FileUploadService {
    private sanitizeFileName(fileName: string): string {
        return fileName
            .normalize("NFD") 
            .replace(/[\u0300-\u036f]/g, "") 
            .replace(/\s+/g, '-') 
            .replace(/[^a-zA-Z0-9.-]/g, ''); 
    }

    async upload(fileContent: Buffer, fileName: string, folder: string, mimeType: string): Promise<string> {
        if (!accessKeyId) throw new Error("Serviço de upload não configurado.");
        if (!fileContent) throw new Error("Conteúdo do arquivo inválido.");

        const cleanName = this.sanitizeFileName(fileName);
        const key = `${appFolder}/${folder}/${Date.now()}-${cleanName}`;

        try {
            const parallelUploads3 = new Upload({
                client: s3Client,
                params: {
                    Bucket: bucketName,
                    Key: key,
                    Body: fileContent, // No Next.js Server Actions, passamos sempre Buffer
                    ContentType: mimeType,
                    ACL: 'public-read' as const,
                },
                queueSize: 4,
                partSize: 1024 * 1024 * 5,
            });

            await parallelUploads3.done();
            return `https://${bucketName}.${spacesEndpoint}/${key}`;

        } catch (e: any) {
            console.error("[File Service] Erro no upload:", e);
            throw new Error("Falha no upload para o Spaces.");
        }
    }

    async deleteFile(fileUrl: string): Promise<void> {
        if (!fileUrl) return;
        try {
            const urlObj = new URL(fileUrl);
            const key = decodeURIComponent(urlObj.pathname.substring(1));

            const params = new DeleteObjectCommand({
                Bucket: bucketName,
                Key: key,
            });

            await s3Client.send(params);
        } catch (error: any) {
            console.error(`[File Service] Erro ao excluir ficheiro ${fileUrl}:`, error.message);
        }
    }
}

export const fileUploadService = new FileUploadService();