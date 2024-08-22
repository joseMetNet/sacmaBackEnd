import "colors";
import cors from "cors";
import express, { Application, Router } from "express";
import fileUpload from "express-fileupload";
import morgan from "morgan";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { EnvConfig, swaggerOptions } from "./config";
import { authenticationRoutes, employeeRoutes, noveltyRoutes } from "./routes";
import { supplierRoutes } from "./supplier/supplier.route";
import { inputRoutes } from "./input";
import { employeePayrollRoutes } from "./payroll";
import { machineryRoutes } from "./machinery/machinery.route";

class Server {
  private app: Application;
  private port: number;

  constructor() {
    this.app = express();
    this.port = EnvConfig.APP_PORT || 8080;
    this.initializeSwagger();
    this.middlewares();
    this.routes();
  }

  private middlewares(): void {
    this.app.use(cors());
    this.app.use(express.static("public"));
    this.app.use(express.json());
    this.app.use(morgan("dev"));
    this.app.use(
      fileUpload({
        useTempFiles: true,
        tempFileDir: "./tmp/",
        createParentPath: true,
      })
    );
    this.app.disable("x-powered-by");
  }

  private initializeSwagger(): void {
    const configSwagger = swaggerJSDoc(swaggerOptions);
    this.app.use(
      "/api/v1/docs",
      swaggerUi.serve,
      swaggerUi.setup(configSwagger)
    );
  }

  private routes(): void {
    authenticationRoutes(this.app);
    employeeRoutes(this.app);
    noveltyRoutes(this.app);
    employeePayrollRoutes(this.app);
    supplierRoutes(this.app);
    machineryRoutes(this.app);
    inputRoutes(this.app);
  }

  public listen(): void {
    console.clear();
    this.app.listen(this.port, () => {
      console.log(` 🔥 Server in port ${this.port}`.bold);
    });
  }
}

export default Server;
