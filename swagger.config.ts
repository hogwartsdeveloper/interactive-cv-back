import { Options } from 'swagger-jsdoc';

export const options: Options = {
	definition: {
		openapi: '3.0.0',
		info: {
			title: 'Hello World',
			version: '1.0.0',
		},
	},
	apis: ['./src/**/*.controller.ts'],
};
