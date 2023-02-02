import { Options } from 'swagger-jsdoc';

export const options: Options = {
	swaggerDefinition: {
		openapi: '3.0.0',
		info: {
			title: 'My API',
			version: '1.0.0',
			description: 'A sample API',
		},
		basePath: '/swagger',
		components: {
			securitySchemes: {
				bearerAuth: {
					type: 'http',
					scheme: 'bearer',
					bearerFormat: 'JWT',
				},
			},
		},
	},
	apis: ['./src//**/*controller.ts'],
};
