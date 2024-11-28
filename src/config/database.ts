import { Sequelize } from "sequelize";
import { EnvConfig } from "./config";

class DatabaseConnection {
  private sequelize: Sequelize;

  constructor() {
    this.sequelize = new Sequelize(
      EnvConfig.DATABASE_NAME,
      EnvConfig.DATABASE_USER,
      EnvConfig.DATABASE_PASSWORD,
      {
        dialect: "mssql",
        host: EnvConfig.DATABASE_SERVER,
        schema: "mvp1",
        port: EnvConfig.DATABASE_PORT,
        dialectOptions: {
          instanceName: "SQLEXPRESS",
          requestTimeout: 50000,
        },
        pool: {
          max: 50,
          min: 0,
          idle: 10000,
        },
      }
    );
  }

  public getSequelize(): Sequelize {
    return this.sequelize;
  }
}

export const dbConnection = new DatabaseConnection().getSequelize();