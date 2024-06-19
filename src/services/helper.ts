import { EnvConfig } from "../config";
import { AuthRefreshTokenPayload, AuthTokenPayload } from "./interface";
import { CustomError } from "../utils";
import {
  BlobServiceClient,
  BlobUploadCommonResponse,
  BlockBlobParallelUploadOptions,
} from "@azure/storage-blob";
import * as jwt from "jsonwebtoken";

export function signAuthToken(payload: AuthTokenPayload): string {
  return jwt.sign(payload, EnvConfig.AUTH_TOKEN_SECRET, {
    algorithm: "HS256",
    issuer: "metnet",
    audience: "audience",
    expiresIn: EnvConfig.AUTH_TOKEN_EXPIRY_DURATION,
  });
}

export function signAuthRefreshToken(payload: AuthRefreshTokenPayload): string {
  return jwt.sign(payload, EnvConfig.REFRESH_TOKEN_SECRET, {
    algorithm: "HS256",
    issuer: "metnet",
    audience: "audience",
    expiresIn: "1d"
  });
}


export async function uploadDocument(
  filePath: string,
  identifier: string
): Promise<CustomError | BlobUploadCommonResponse> {
  try {
    const blobServiceClient = BlobServiceClient.fromConnectionString(
      EnvConfig.AZURE_STORAGE_CONNECTION_STRING,
    );
    const containerClient = blobServiceClient.getContainerClient(
      EnvConfig.AZURE_STORAGE_CONTAINER_DOCUMENT
    );
    const blobName = `${identifier}.pdf`;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    const blobOptions: BlockBlobParallelUploadOptions = { blobHTTPHeaders: { blobContentType: "application/pdf" } };
    const uploadBlobResponse = await blockBlobClient.uploadFile(filePath, blobOptions);
    return uploadBlobResponse;
  } catch (err: any) {
    console.log(err);
    return CustomError.internalServer(err);
  }
}

export async function uploadImageProfile(
  filePath: string,
  identifier: string
): Promise<CustomError | BlobUploadCommonResponse> {
  try {
    const blobServiceClient = BlobServiceClient.fromConnectionString(
      EnvConfig.AZURE_STORAGE_CONNECTION_STRING,
    );
    const containerClient = blobServiceClient.getContainerClient(
      EnvConfig.AZURE_STORAGE_CONTAINER_IMAGE_PROFILE
    );
    const blobName = `${identifier}.png`;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    const blobOptions: BlockBlobParallelUploadOptions = { blobHTTPHeaders: { blobContentType: "image/jpg" } };
    const uploadBlobResponse = await blockBlobClient.uploadFile(filePath, blobOptions);
    return uploadBlobResponse;
  } catch (err: any) {
    console.log(err);
    return CustomError.internalServer(err);
  }
}

export async function deleteImageProfile (
  blobName: string
): Promise<CustomError | BlobUploadCommonResponse> {
  try {
    const blobServiceClient = BlobServiceClient.fromConnectionString(
      EnvConfig.AZURE_STORAGE_CONNECTION_STRING,
    );
    const containerClient = blobServiceClient.getContainerClient(
      EnvConfig.AZURE_STORAGE_CONTAINER_IMAGE_PROFILE
    );
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    const uploadBlobResponse = await blockBlobClient.delete();
    return uploadBlobResponse;
  } catch (err: any) {
    console.log(err);
    return CustomError.internalServer(err);
  }
}

export async function deleteDocument(
  blobName: string
): Promise<CustomError | BlobUploadCommonResponse> {
  try {
    const blobServiceClient = BlobServiceClient.fromConnectionString(
      EnvConfig.AZURE_STORAGE_CONNECTION_STRING,
    );
    const containerClient = blobServiceClient.getContainerClient(
      EnvConfig.AZURE_STORAGE_CONTAINER_DOCUMENT
    );
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    const uploadBlobResponse = await blockBlobClient.delete();
    return uploadBlobResponse;
  } catch (err: any) {
    console.log(err);
    return CustomError.internalServer(err);
  }
}