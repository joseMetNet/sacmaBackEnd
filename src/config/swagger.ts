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
    "./src/features/authentication/*route.ts",
    "./src/features/invoice/*route.ts",
    "./src/features/supplier/*route.ts",
    "./src/features/input/*route.ts",
    "./src/features/payroll/*route.ts",
    "./src/features/machinery/*route.ts",
    "./src/features/cost-center/*route.ts",
    "./src/features/work-tracking/*route.ts",
    "./src/features/quotation/*route.ts",
    "./src/features/novelty/*route.ts",
    "./src/features/order/*route.ts",
    "./src/features/employee/*route.ts",
    "./src/features/expenditure/*route.ts",
    "./src/features/revenue-center/*route.ts",
  ],
};
