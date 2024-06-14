import * as dotenv from "dotenv";
dotenv.config();

class Config {
  private readonly appPort: number;
  private readonly databaseUser: string;
  private readonly databasePassword: string;
  private readonly databasePort: number;
  private readonly databaseName: string;
  private readonly databaseServer: string;
  private readonly authUrl: string;
  private readonly userGroup:  string;
  private readonly authTokenSecret: string;
  private readonly authTokenExpiryDuration: string;
  private readonly azureStorageAccountName: string;
  private readonly azureStorageContainerDocument: string;
  private readonly azureStorageContainerImageProfile: string;

  constructor() {
    this.appPort = parseInt(this.getEnvVariable("APP_PORT"));
    this.databaseUser = this.getEnvVariable("DATABASE_USER");
    this.databasePassword = this.getEnvVariable("DATABASE_PASSWORD");
    this.databasePort = parseInt(this.getEnvVariable("DATABASE_PORT"));
    this.databaseName = this.getEnvVariable("DATABASE_NAME");
    this.databaseServer = this.getEnvVariable("DATABASE_SERVER");
    this.authUrl = this.getEnvVariable("AUTH_URL");
    this.userGroup = this.getEnvVariable("USER_GROUP");
    this.authTokenSecret = this.getEnvVariable("AUTH_TOKEN_SECRET");
    this.authTokenExpiryDuration = this.getEnvVariable("AUTH_TOKEN_EXPIRY_DURATION");
    this.azureStorageAccountName = this.getEnvVariable("AZURE_STORAGE_ACCOUNT_NAME");
    this.azureStorageContainerDocument = this.getEnvVariable("AZURE_STORAGE_CONTAINER_DOCUMENT");
    this.azureStorageContainerImageProfile = this.getEnvVariable("AZURE_STORAGE_CONTAINER_IMAGE_PROFILE");
  }

  private getEnvVariable(name: string): string {
    const env = process.env[name];
    if (!env) {
      throw new Error(`Environment variable ${name} not found`);
    }
    return env;
  }

  get APP_PORT(): number {
    return this.appPort;
  }

  get DATABASE_USER(): string {
    return this.databaseUser;
  }

  get DATABASE_PASSWORD(): string {
    return this.databasePassword;
  }

  get DATABASE_PORT(): number {
    return this.databasePort;
  }

  get DATABASE_NAME(): string {
    return this.databaseName;
  }

  get DATABASE_SERVER(): string {
    return this.databaseServer;
  }

  get AUTH_URL(): string {
    return this.authUrl;
  }

  get USER_GROUP(): string {
    return this.userGroup;
  }

  get AUTH_TOKEN_SECRET(): string {
    return this.authTokenSecret;
  }

  get AUTH_TOKEN_EXPIRY_DURATION(): string {
    return this.authTokenExpiryDuration;
  }

  get AZURE_STORAGE_ACCOUNT_NAME(): string {
    return this.azureStorageAccountName;
  }

  get AZURE_STORAGE_CONTAINER_DOCUMENT(): string {
    return this.azureStorageContainerDocument;
  }

  get AZURE_STORAGE_CONTAINER_IMAGE_PROFILE(): string {
    return this.azureStorageContainerImageProfile;
  }
}

export const EnvConfig = Object.freeze(new Config());
