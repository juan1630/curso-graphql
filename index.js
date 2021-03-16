const { ApolloError, ApolloServer } = require('apollo-server');
const typeDefs = require('./db/schema');
const resolvers = require('./db/resolvers');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: 'variables.env' });


const url = "http://localhost:4000";

const conectToDB = require('./db/db');


// servidor 



/// conectando a la DB
conectToDB();


const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
        console.log( req.headers );
        // se pasa a todos los resolvers
        // console.log();
        const token = req.headers['authorization'] || "";

        if (token) {
            try {

                const usuario = jwt.verify(token.replace('Bearer ', ''), process.env.salt);
                console.log(usuario);
                return {
                    usuario
                }

            } catch (error) {
                console.log(error);
                throw new Error('Un error de autenticacion');
            }
        }
    }
});

//arrancamos el servidor 

server.listen()
    .then((resp) => {
        console.log(`Server running on URL: ${url}`);
    });


// una query es equivalente al get o al select, es la forma en la que se extraen los datos
// el query es universal, es lo mismo en el stack que se esta usando


//mutations 
// sirven para crear, actualizar y borrar, de igual forma son universales

// Schema 
// describe los tipos de los datos, las queries


// resolvers son las funciones que nos devuelven los datos de la DB