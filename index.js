const { ApolloError, ApolloServer } = require('apollo-server');
const typeDefs = require('./db/schema');
const resolvers = require('./db/resolvers');


const url = "http://localhost:4000";

const conectToDB = require('./db/db');


// servidor 



/// conectando a la DB
conectToDB();


const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: () => {
        const miContext = "Hola!!!";
        return {
            miContext
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