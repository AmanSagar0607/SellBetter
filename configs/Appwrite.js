import { Client, Storage, ID } from 'node-appwrite';

// Initialize Appwrite client
const client = new Client();

// Check if we're in a server environment
if (typeof window === 'undefined') {
    // Server-side configuration
    client
        .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
        .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
        .setKey(process.env.APPWRITE_API_KEY);
} else {
    // Client-side configuration
    client
        .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
        .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID);
}

// Initialize storage
const storage = new Storage(client);
const bucketId = process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID;

// Helper function to upload file using InputFile
async function uploadFile(file) {
    try {
        if (!file) {
            throw new Error('No file provided');
        }

        // Convert file to Uint8Array for Appwrite
        const buffer = await file.arrayBuffer();
        const uint8Array = new Uint8Array(buffer);
        
        if (!uint8Array.length) {
            throw new Error('File content is empty');
        }

        // Create file in Appwrite Storage
        const result = await storage.createFile(
            bucketId,
            ID.unique(),
            uint8Array,
            ['role:all'],
            file.name
        );

        // Get file URL
        const fileUrl = storage.getFileView(bucketId, result.$id);

        return {
            fileId: result.$id,
            fileUrl: fileUrl.href,
            fileName: file.name
        };
    } catch (error) {
        console.error('Error uploading file:', error);
        throw new Error(`File upload failed: ${error.message}`);
    }
}

// Helper function to delete file
async function deleteFile(fileId) {
    try {
        await storage.deleteFile(bucketId, fileId);
    } catch (error) {
        console.error('Error deleting file:', error);
        throw error;
    }
}

// Helper function to get file preview
async function getFilePreview(fileId) {
    return storage.getFilePreview(bucketId, fileId);
}

// Helper function to get file view
async function getFileView(fileId) {
    return storage.getFileView(bucketId, fileId);
}

export { storage, bucketId, uploadFile, deleteFile, getFilePreview, getFileView };