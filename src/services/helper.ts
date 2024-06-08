import { DefaultAzureCredential } from "@azure/identity";
import { EnvConfig } from "../config";
import { AuthTokenPayload } from "./interface";
import { CustomError } from "../utils";
import {
  BlobServiceClient,
  BlobUploadCommonResponse,
} from "@azure/storage-blob";
import * as jwt from "jsonwebtoken";

export function createAuthToken(payload: AuthTokenPayload): string {
  return jwt.sign(payload, EnvConfig.AUTH_TOKEN_SECRET, {
    algorithm: "HS256",
    issuer: "metnet",
    audience: "audience",
    expiresIn: EnvConfig.AUTH_TOKEN_EXPIRY_DURATION,
  });
}

export async function uploadImageProfile(
  filePath: string,
  identifier: string
): Promise<CustomError | BlobUploadCommonResponse> {
  try {
    const defaultAzureCredential = new DefaultAzureCredential();
    const blobServiceClient = new BlobServiceClient(
      `https://${EnvConfig.AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net`,
      defaultAzureCredential
    );
    const containerClient = blobServiceClient.getContainerClient(
      EnvConfig.AZURE_STORAGE_CONTAINER_NAME
    );
    const blobName = `${identifier}.png`;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    const uploadBlobResponse = await blockBlobClient.uploadFile(filePath);
    return uploadBlobResponse;
  } catch (err: any) {
    console.log(err);
    return CustomError.internalServer(err);
  }
}

export async function deleteImageProfile(
  blobName: string
): Promise<CustomError | BlobUploadCommonResponse> {
  try {
    const defaultAzureCredential = new DefaultAzureCredential();
    const blobServiceClient = new BlobServiceClient(
      `https://${EnvConfig.AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net`,
      defaultAzureCredential
    );
    const containerClient = blobServiceClient.getContainerClient(
      EnvConfig.AZURE_STORAGE_CONTAINER_NAME
    );
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    const uploadBlobResponse = await blockBlobClient.delete();
    return uploadBlobResponse;
  } catch (err: any) {
    console.log(err);
    return CustomError.internalServer(err);
  }
}
