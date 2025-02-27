import { BlobServiceClient, BlobUploadCommonResponse, BlockBlobParallelUploadOptions } from "@azure/storage-blob";
import { CustomError } from "./custom-error";
import { EnvConfig } from "../config";

export async function uploadFile(
  filePath: string,
  identifier: string,
  contentType: string,
  containerClientName: string
): Promise<CustomError | BlobUploadCommonResponse> {
  try {
    const blobServiceClient = BlobServiceClient.fromConnectionString(
      EnvConfig.AZURE_STORAGE_CONNECTION_STRING,
    );
    const containerClient =
      blobServiceClient.getContainerClient(containerClientName);
    const blobName = contentType === "application/pdf" ?
      `${identifier}.pdf` :
      `${identifier}.png`;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    const blobOptions: BlockBlobParallelUploadOptions = { blobHTTPHeaders: { blobContentType: contentType } };
    const uploadBlobResponse = await blockBlobClient.uploadFile(filePath, blobOptions);
    return uploadBlobResponse;
  } catch (err: any) {
    console.error(err);
    return CustomError.internalServer(err);
  }
}

export async function deleteFile(
  blobName: string,
  containerClientName: string
): Promise<CustomError | BlobUploadCommonResponse> {
  try {
    const blobServiceClient = BlobServiceClient.fromConnectionString(
      EnvConfig.AZURE_STORAGE_CONNECTION_STRING,
    );
    const containerClient = blobServiceClient.getContainerClient(containerClientName);
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    const uploadBlobResponse = await blockBlobClient.delete();
    return uploadBlobResponse;
  } catch (err: any) {
    console.error(err);
    return CustomError.internalServer(err);
  }
}