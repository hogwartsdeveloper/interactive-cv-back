import { Options } from "swagger-jsdoc";

export const options: Options = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "CV API",
      version: "1.0.0",
      description: "sumurai.kz",
    },
    basePath: "/swagger",
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./src//**/*controller.ts"],
};
