import swaggerUi from 'swagger-ui-express'; 
import swaggerJsdoc from 'swagger-jsdoc';

// Swagger definition
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Powerlifting Records API',
    version: '1.0.0',
    description: 'API documentation for the Powerlifting Records Backend',
  },
  servers: [
    {
      url: 'http://localhost:3000',
    },
  ],
  tags: [
    {
      name: "Lift types",
      description: "API to retrieve all lift types"
    },
    {
      name: "Lifts",
      description: "API to manage lifts"
    },
    {
      name: "DOTS scores",
      description: "API to manange an user's DOTS score record"
    }, 
    {
      name: "DOTS classifications",
      description: "API to retrieve and calculate DOTS classification"
    },
    {
      name: "Coefficients by sex", 
      description: "API to retrieve sex-specific coefficients for DOTS calculation"
    }
   
  ],
};

const options = {
  swaggerDefinition,
  apis: [
    './src/index.js',
    './src/endpoints/*.js'
  ],
};

const swaggerSpec = swaggerJsdoc(options);

export default function(app) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
} 