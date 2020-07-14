const { ApolloServer } = require('apollo-server');

const typeDefs = require('./db/schema');
const resolvers = require('./db/resolvers');

const jwt = require('jsonwebtoken');
require('dotenv').config({path: 'variables.env'});

const conectarDB = require('./config/db');

// Conectar a la DB
conectarDB();

// Servidor
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({req}) => {

    const token = req.headers['authorization'] || '';

    if (token) {
      try {
        const usuario = jwt.verify(token.replace('Bearer ', ''), process.env.SECRET);

        return {
          usuario
        };
      } catch (error) {
        console.log('Hubo un error');
        console.log(error);
      }
    }
  }
});

// Arrancar el servidor
server.listen({port: 4000}, () => {
  console.log(`> Ready on port`)
});