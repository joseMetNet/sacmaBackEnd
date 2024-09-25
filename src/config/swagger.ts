import { SwaggerOptions } from "swagger-ui-express";

export const swaggerOptions: SwaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.1",
    info: {
      title: "Documentation for Sacma API",
      version: "1.0.0",
      descripcion: "API for Sacma",
      contact: {
        name: "Metnet",
        email: "development@metnet.co",
        url: "https://metnet.co/"
      },
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        }
      }
    },
    "security": [
      {
        "bearerAuth": []
      }
    ],
    servers: [
      {
        url: "http://localhost:8080/api",
        descripcion: "Development server"
      },
      {
        url: "https://sacma-dev.azurewebsites.net/api",
        descripcion: "Production server"
      }
    ]
  },
  apis: [
    "./src/routes/*.route.ts",
    "./src/supplier/*route.ts",
    "./src/input/*route.ts",
    "./src/payroll/*route.ts",
    "./src/machinery/*route.ts",
    "./src/cost-center/*route.ts",
  ],
};
